// The table shared over the local network, played between headless devices.
// Every scenario deals the host a chosen hand, then has each device press its
// own buttons, and checks both what the host decided and what each guest saw.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startRelay, device, sharedTable, buttons, press, pending, until, wait } from "./support/table.mjs";

let relay;
before(async () => { relay = await startRelay(); });
after(async () => { await relay.close(); });

async function closeTable(table) {
  if (table.host.run("lanConnection")) table.host.run("leaveLanRoom()");
  await wait(100);
  for (const d of table.devices) {
    assert.deepEqual(d.errors, [], `${d.name} reported script errors`);
    d.close();
  }
}

const rig = (table, setup) => table.host.run(`rigTable(${JSON.stringify(setup)})`);
const hostDiscards = (table, tile) =>
  table.host.run(`act({ type: "discard", tileIndex: state.players[0].hand.lastIndexOf(${JSON.stringify(tile)}) })`);
// Plays the table forward until the condition holds: every claim offered on
// the way is declined, and every person whose turn comes throws the tile they
// just drew — except `hold`, who is only asked to decline offers, because the
// test wants to act for them itself.
async function advanceUntil(table, condition, { hold = null } = {}) {
  for (let i = 0; i < 150 && !condition(); i++) {
    for (const d of table.devices) {
      if (pending(d)) { press(d, "pass"); continue; }
      if (d === hold) continue;
      if (d.run("state.turn === 0 && state.pendingDiscard && !state.gameOver")) {
        d.run("discard(state.players[0].hand.lastIndexOf(state.players[0].drawnTile))");
      }
    }
    await wait(20);
  }
  assert.ok(condition(), "the table never reached the expected moment");
}

// guest1 (seat 1): sequences and an East triplet — East is the round wind, so
// yakuhai — waiting on 5m alone.
const GUEST1_WAITING_ON_5M = ["1m", "2m", "3m", "4p", "5p", "6p", "7s", "8s", "9s", "E", "E", "E", "5m"];
// guest2 (seat 2): a White dragon triplet for its yaku, also waiting on 5m.
const GUEST2_WAITING_ON_5M = ["1p", "2p", "3p", "4s", "5s", "6s", "7m", "8m", "9m", "Wh", "Wh", "Wh", "5m"];

test("a guest wins by ron, and each device tells it from its own chair", async () => {
  const table = await sharedTable(relay);
  const { host, guest1, guest2 } = table;
  rig(table, { hands: { 1: GUEST1_WAITING_ON_5M, 0: ["5m"] } });
  await wait(80);
  hostDiscards(table, "5m");
  await until(() => pending(guest1)?.type === "awaitingHumanRon", 3000, "the ron offer to reach guest1");

  assert.equal(pending(guest1).winner, 0, "the offer is addressed to guest1 as seat 0");
  assert.equal(pending(guest2), null, "guest2 learns nothing about guest1's offer");
  assert.deepEqual(buttons(host), [], "the host is offered nothing");
  assert.deepEqual([...buttons(guest1)].sort(), ["pass", "ron"]);

  const hostScore = host.run("state.players[0].score");
  press(guest1, "ron");
  await until(() => host.run("state.gameOver"), 3000, "the host to settle the ron");
  assert.equal(host.run("state.win.winner"), 1);
  assert.equal(host.run("state.win.type"), "Ron");
  assert.ok(host.run("state.players[0].score") < hostScore, "the discarder paid");

  await until(() => guest1.run("state.gameOver") && guest2.run("state.gameOver"), 3000, "the guests to see the end");
  assert.equal(guest1.run("state.win.winner"), 0, "guest1 sees itself winning");
  assert.equal(guest2.run("state.win.winner"), 3, "guest2 sees the player on its left winning");
  assert.match(guest1.run("els.statusText.textContent"), /^You win by Ron/);
  assert.match(host.run("els.statusText.textContent"), /^Player 2 wins by Ron/);
  assert.equal(guest2.run("state.win.hand.length"), 14, "the winning hand is shown to everyone");
  assert.deepEqual(buttons(guest1), ["lanWaitingForHost(disabled)"], "only the host deals the next hand");
  await closeTable(table);
});

test("a guest wins by tsumo", async () => {
  const table = await sharedTable(relay);
  rig(table, { hands: { 1: GUEST1_WAITING_ON_5M, 0: ["N"] }, nextDraws: ["5m"] });
  await wait(80);
  hostDiscards(table, "N");
  await advanceUntil(table, () => table.host.run("state.gameOver"), { hold: table.guest1 });
  assert.equal(table.host.run("state.win.winner"), 1);
  assert.equal(table.host.run("state.win.type"), "Tsumo");
  await until(() => table.guest1.run("state.gameOver"), 3000, "guest1 to see its win");
  assert.equal(table.guest1.run("state.win.winner"), 0);
  await closeTable(table);
});

test("when the first claimant lets a ron go, the next one in turn order is asked", async () => {
  const table = await sharedTable(relay);
  const { host, guest1, guest2 } = table;
  rig(table, { hands: { 1: GUEST1_WAITING_ON_5M, 2: GUEST2_WAITING_ON_5M, 0: ["5m"] } });
  await wait(80);
  hostDiscards(table, "5m");
  await until(() => pending(guest1)?.type === "awaitingHumanRon", 3000, "guest1 to be asked first");
  assert.equal(pending(guest2), null, "guest2 waits unseen while guest1 decides");
  press(guest1, "pass");
  await until(() => pending(guest2)?.type === "awaitingHumanRon", 3000, "the offer to move on to guest2");
  assert.equal(pending(guest1), null);
  press(guest2, "ron");
  await until(() => host.run("state.gameOver"), 3000, "guest2's ron");
  assert.equal(host.run("state.win.winner"), 2);
  await closeTable(table);
});

test("pon is asked before chi, and chi is asked once pon is passed", async () => {
  const table = await sharedTable(relay);
  const { host, guest1, guest2 } = table;
  // guest1, next after the host, could chi a 5s; guest2 could pon it.
  rig(table, { hands: {
    1: ["4s", "6s", "1m", "1m", "9p", "9p", "N", "N", "W", "W", "G", "R", "2p"],
    2: ["5s", "5s", "1p", "4m", "7m", "2s", "9s", "S", "S", "Wh", "G", "R", "3p"],
    0: ["5s"]
  } });
  await wait(80);
  hostDiscards(table, "5s");
  await until(() => pending(guest2)?.type === "awaitingHumanCall", 3000, "pon to be offered first");
  assert.equal(pending(guest1), null, "guest1 is not asked yet");
  assert.ok(buttons(guest2).includes("pon") && !buttons(guest2).includes("chi"));

  press(guest2, "pass");
  await until(() => pending(guest1)?.type === "awaitingHumanCall", 3000, "chi to be offered next");
  assert.ok(buttons(guest1).includes("chi"));
  press(guest1, "chi");
  await until(() => host.run("state.turn === 1 && state.pendingDiscard"), 3000, "the chi to land");

  const meld = host.run("state.players[1].melds[0]");
  assert.equal(meld.type, "chi");
  assert.deepEqual([...meld.tiles], ["4s", "5s", "6s"]);
  assert.equal(meld.from, 0);
  assert.equal(host.run("state.players[0].discards[0].calledBy"), 1);
  await until(() => guest2.run("state.turn") === 3, 3000, "guest2 to catch up");
  assert.equal(guest2.run("state.players[2].discards[0].calledBy"), 3, "guest2 sees the tile taken by the player on its left");
  assert.match(guest1.run("els.statusText.textContent"), /^You call Chi/);
  assert.match(guest2.run("els.statusText.textContent"), /^Player 2 calls Chi/);
  await closeTable(table);
});

test("a guest calls an open kan and then declares a closed one", async () => {
  const table = await sharedTable(relay);
  const { host, guest1, guest2 } = table;
  rig(table, { hands: { 1: ["N", "N", "N", "W", "W", "W", "W", "1m", "5p", "9s", "2m", "7p", "3s"], 0: ["N"] } });
  await wait(80);
  const indicators = host.run("state.doraIndicators.length");
  hostDiscards(table, "N");
  await until(() => pending(guest1)?.type === "awaitingHumanCall", 3000, "the kan offer");
  assert.ok(buttons(guest1).includes("kan") && buttons(guest1).includes("pon"));
  press(guest1, "kan");
  await until(() => host.run("state.players[1].melds.length === 1 && state.pendingDiscard"), 3000, "the open kan");
  assert.equal(host.run("state.players[1].melds[0].type"), "minkan");
  assert.equal(host.run("state.doraIndicators.length"), indicators + 1, "a kan turns another indicator");

  // Wait for guest1's own screen to show the open kan first. Until then it still
  // shows the offer it just answered — which also has a "kan" button.
  await until(() => guest1.run("state.players[0].melds.length === 1 && state.turn === 0 && state.pendingDiscard"),
    3000, "guest1 to see its open kan");
  assert.ok(buttons(guest1).includes("kan"), "the closed kan is offered");
  press(guest1, "kan");
  await until(() => host.run("state.players[1].melds.length") === 2, 3000, "the closed kan");
  assert.equal(host.run("state.players[1].melds[1].type"), "ankan");
  assert.ok(host.run("state.turn === 1 && state.pendingDiscard"), "still guest1's discard");
  await until(() => guest2.run("state.players[3].melds.length") === 2, 3000, "guest2 to see both kans");
  await closeTable(table);
});

test("a guest in riichi pays its stick and is held to the tile it draws", async () => {
  const table = await sharedTable(relay);
  const { host, guest1 } = table;
  // Every draw is fixed: guest1 draws the N that makes its wait, then the others
  // draw tiles that cannot finish an E/N wait, then guest1 draws a 9m.
  rig(table, { hands: { 1: ["1m", "2m", "3m", "4p", "5p", "6p", "7s", "8s", "9s", "E", "E", "N", "S"], 0: ["G"] },
    nextDraws: ["N", "1s", "2s", "3s", "9m"] });
  await wait(80);
  hostDiscards(table, "G");
  await advanceUntil(table, () => buttons(guest1).includes("riichi"), { hold: guest1 });
  press(guest1, "riichi");
  await until(() => host.run("state.players[1].riichi"), 3000, "the declaration");
  assert.equal(host.run("state.players[1].score"), 24000);
  assert.equal(host.run("state.riichiPot"), 1000);

  guest1.run(`discard(state.players[0].hand.indexOf("S"))`);
  await until(() => host.run("state.players[1].discards.length") === 1, 3000, "the declaration tile");
  assert.equal(host.run("state.players[1].discards[0].riichi"), true);

  // On its next turn guest1 may only throw what it draws.
  await advanceUntil(table, () => host.run("state.turn === 1 && state.pendingDiscard"), { hold: guest1 });
  const drawn = host.run("state.players[1].drawnTile");
  const other = guest1.run(`state.players[0].hand.findIndex(t => t !== ${JSON.stringify(drawn)})`);
  guest1.run(`sendIntentToHost({ type: "discard", tileIndex: ${other} })`);
  await wait(150);
  assert.equal(host.run("state.players[1].discards.length"), 1, "a locked hand cannot change its wait");
  await closeTable(table);
});

test("a guest cannot move out of turn or claim what it was never offered", async () => {
  const table = await sharedTable(relay);
  const { host, guest2 } = table;
  // The host is holding its opening discard, so nothing moves on its own.
  const snapshot = () => host.run("JSON.stringify({ t: state.turn, d: state.discardCount, p: state.pendingAction, h: state.players.map(x => [x.hand.join(), x.melds.length, x.riichi, x.score]) })");
  const before = snapshot();
  const attempts = [
    { type: "discard", tileIndex: 0 }, { type: "pon" }, { type: "minkan" }, { type: "chi", option: ["1m", "2m"] },
    { type: "ron" }, { type: "tsumo" }, { type: "riichi" }, { type: "pass" },
    { type: "ankan", tile: "1m" }, { type: "kakan", tile: "1m" }, { type: "bogus" }, null,
    { type: "discard", tileIndex: "../etc" }
  ];
  for (const intent of attempts) guest2.run(`sendIntentToHost(${JSON.stringify(intent)})`);
  await wait(250);
  assert.equal(snapshot(), before);
  await closeTable(table);
});

test("a guest who leaves on its own turn is replaced by a bot that plays on", async () => {
  const table = await sharedTable(relay);
  const { host, guest1 } = table;
  rig(table, { hands: { 0: ["N"] } });
  await wait(80);
  hostDiscards(table, "N");
  await advanceUntil(table, () => host.run("state.turn === 1 && state.pendingDiscard"), { hold: guest1 });
  guest1.run("lanConnection.guest.close()");
  await until(() => host.run("state.players[1].controller") === "bot", 3000, "seat 1 to pass to a bot");
  await until(() => host.run("state.players[1].discards.length") === 1, 3000, "the bot to discard in its place");
  assert.equal(guest1.run("isGuest()"), false, "guest1 is back at its own table");
  await closeTable(table);
});

test("a guest who leaves while offered a ron is replaced by a bot that takes it", async () => {
  const table = await sharedTable(relay);
  const { host, guest1 } = table;
  rig(table, { hands: { 1: GUEST1_WAITING_ON_5M, 0: ["5m"] } });
  await wait(80);
  hostDiscards(table, "5m");
  await until(() => pending(guest1)?.type === "awaitingHumanRon", 3000, "the offer");
  guest1.run("lanConnection.guest.close()");
  await until(() => host.run("state.gameOver"), 3000, "the bot's ron");
  assert.equal(host.run("state.win.winner"), 1);
  assert.equal(host.run("state.players[1].controller"), "bot");
  await closeTable(table);
});

test("a guest who leaves while offered a call is passed over and the hand goes on", async () => {
  const table = await sharedTable(relay);
  const { host, guest2 } = table;
  rig(table, { hands: { 2: ["5s", "5s", "1p", "4m", "7m", "2s", "9s", "S", "S", "Wh", "G", "R", "3p"], 0: ["5s"] } });
  await wait(80);
  hostDiscards(table, "5s");
  await until(() => pending(guest2)?.type === "awaitingHumanCall", 3000, "the pon offer");
  guest2.run("lanConnection.guest.close()");
  table.devices = table.devices.filter(d => d !== guest2);
  await advanceUntil(table, () => host.run("state.discardCount") >= 2);
  table.devices.push(guest2);
  assert.equal(host.run("state.players[2].controller"), "bot");
  assert.equal(host.run("state.players[2].melds.length"), 0, "a bot does not call in its place");
  await closeTable(table);
});

test("closing the room sends guests back to their own match and keeps every save intact", async () => {
  const relayTable = await (async () => {
    // Both guest1 and the host have a solo match going before the room opens.
    const table = { host: device("host", { relay }), guest1: device("guest1") };
    await wait(150);
    for (const d of [table.host, table.guest1]) d.run("closeWelcome(); startMatch();");
    return table;
  })();
  const { host, guest1 } = relayTable;
  const soloSave = d => d.run("localStorage.getItem('mahjong-vibes-save')");
  const hostSave = soloSave(host);
  const guestSave = soloSave(guest1);
  assert.ok(hostSave && guestSave, "both start with a saved solo match");

  host.run("hostLanRoom()");
  await until(() => host.run("lanConnection?.kind") === "host", 3000, "the room");
  guest1.run(`els.lanAddress.value = "${relay.address}"; joinLanRoom();`);
  await until(() => host.run("lanConnection.peers.size") === 1, 3000, "guest1 to join");
  host.run("startSharedMatch()");
  await until(() => guest1.run("isGuest()"), 3000, "guest1 to be seated");
  host.run(`act({ type: "discard", tileIndex: state.players[0].hand.length - 1 })`);
  await wait(300);
  assert.equal(soloSave(host), hostSave, "the shared match never overwrites the host's solo save");
  assert.equal(soloSave(guest1), guestSave, "a guest never writes the host's table into its own save");

  host.run("leaveLanRoom()");
  await until(() => !guest1.run("isGuest()"), 3000, "guest1 to go back");
  const restored = JSON.parse(guestSave).state;
  assert.deepEqual([...guest1.run("state.players[0].hand")], restored.players[0].hand, "guest1 is back in its own hand");
  assert.equal(host.run("lanTable"), null);
  assert.deepEqual([...host.run("state.players.map(p => p.controller)")], ["host", "bot", "bot", "bot"], "the host plays on with bots");
  for (const d of [host, guest1]) { assert.deepEqual(d.errors, []); d.close(); }
});

test("a save from before seats had owners still resumes, with its pending call", async () => {
  // Written the way 1.1.0 wrote it: no controller on players, no seat on the offer.
  const solo = device("solo-writer");
  await wait(150);
  solo.run("closeWelcome(); startMatch();");
  const legacy = JSON.parse(solo.run("localStorage.getItem('mahjong-vibes-save')"));
  solo.close();
  legacy.state.players.forEach(p => { delete p.controller; delete p.seat; delete p.clientId; });
  legacy.state.players[0].hand = ["5s", "5s", "1p", "4m", "7m", "2s", "9s", "S", "S", "Wh", "G", "R", "3p"];
  legacy.state.players[3].discards = [{ tile: "5s", seq: 1, tsumogiri: false, riichi: false, calledBy: null, callType: null }];
  Object.assign(legacy.state, { turn: 3, pendingDiscard: false, lastDiscard: "5s", lastDiscardFrom: 3, gameOver: false,
    pendingAction: { type: "awaitingHumanCall", tile: "5s", fromSeat: 3 } });

  const reopened = device("solo-reader", { storage: { "mahjong-vibes-save": JSON.stringify(legacy) } });
  await until(() => reopened.run("typeof viewerActions") === "function", 3000, "the game to load");
  assert.deepEqual([...reopened.run("state.players.map(p => p.controller)")], ["host", "bot", "bot", "bot"]);
  assert.ok(buttons(reopened).includes("pon"), "the pon offered before the update is offered again");
  press(reopened, "pon");
  assert.equal(reopened.run("state.players[0].melds[0].type"), "pon");
  assert.deepEqual(reopened.errors, []);
  reopened.close();
});
