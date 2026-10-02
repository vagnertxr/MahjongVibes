// The lobby around a shared table: names, the chair list, coming back after a
// dropped connection, and sitting down after the match has started.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startRelay, device, until, wait } from "./support/table.mjs";

let relay;
before(async () => { relay = await startRelay(); });
after(async () => { await relay.close(); });

const chairs = d => JSON.parse(d.run("JSON.stringify([...els.lanSeats.children].map(li => li.textContent))"));
const summary = d => d.run("els.lanPeers.textContent");
const named = (d, name) => d.run(`els.lanName.value = ${JSON.stringify(name)}; onNameChanged();`);

async function openRoom(hostName) {
  const host = device("host", { relay });
  await wait(120);
  host.run("closeWelcome()");
  if (hostName) named(host, hostName);
  host.run("hostLanRoom()");
  await until(() => host.run("lanConnection?.kind") === "host", 3000, "the room to open");
  return host;
}

async function join(host, guest, name) {
  if (name !== undefined) named(guest, name);
  const before = host.run("lanConnection.members.size");
  guest.run(`closeWelcome(); els.lanAddress.value = "${relay.address}"; joinLanRoom();`);
  await until(() => guest.run("lanConnection?.kind") === "guest", 3000, `${guest.name} to connect`);
  await until(() => host.run("lanConnection.members.size") > before, 3000, `${guest.name} to introduce itself`);
}

async function putAway(...devices) {
  for (const d of devices) {
    assert.deepEqual(d.errors, [], `${d.name} reported script errors`);
    d.close();
  }
  await wait(60);
}

test("everyone sees the chairs by name before the match, and the host can start any time", async () => {
  const host = await openRoom("Vagner");
  const ana = device("ana");
  const bia = device("bia");
  await join(host, ana, "Ana");
  await join(host, bia, "Bia");
  await until(() => chairs(ana).length === 4 && chairs(bia)[2]?.includes("Bia"), 3000, "the lobby to reach the guests");

  assert.deepEqual(chairs(host), ["Vagner (host) — you", "Ana", "Bia", "Empty — a bot plays"]);
  assert.deepEqual(chairs(ana), ["Vagner (host)", "Ana — you", "Bia", "Empty — a bot plays"]);
  assert.match(summary(ana), /Waiting for Vagner to start the match/);
  assert.equal(host.run("els.lanStartBtn.disabled"), false);

  host.run("startSharedMatch()");
  await until(() => ana.run("isGuest()") && bia.run("isGuest()"), 3000, "seating");
  // Seat 1 is to Vagner's right; from Ana's chair Vagner is on her left.
  assert.equal(host.run("document.querySelector('#seat-1 .name').textContent.trim()"), "Ana");
  assert.equal(ana.run("document.querySelector('#seat-3 .name').textContent.trim()"), "Vagner");
  assert.equal(ana.run("document.querySelector('#seat-1 .name').textContent.trim()"), "Bia");
  assert.equal(ana.run("els.newGameBtn.hidden"), true, "only the host deals a new match");
  assert.equal(host.run("els.newGameBtn.hidden"), false);

  host.run("leaveLanRoom()");
  await until(() => !ana.run("isGuest()"), 3000, "Ana to go home");
  assert.equal(ana.run("els.newGameBtn.hidden"), false, "back at her own table, New Match is hers again");
  await putAway(host, ana, bia);
});

test("a name typed on one phone is shown as text on every other one", async () => {
  const host = await openRoom("Vagner");
  const mallory = device("mallory");
  await join(host, mallory, '<img src=x onerror="window.pwned=1">');
  host.run("startSharedMatch()");
  await until(() => mallory.run("isGuest()"), 3000, "seating");
  await wait(100);
  const label = host.run("document.querySelector('#seat-1 .name').textContent.trim()");
  assert.equal(label, "<img src=x onerr", "kept as characters, cut to sixteen");
  assert.equal(host.run("document.querySelectorAll('#seat-1 .name img:not(.tile-face)').length"), 0, "no element was made from it");
  assert.equal(host.run("window.pwned"), undefined);
  assert.ok(chairs(host).includes("<img src=x onerr"));
  host.run("leaveLanRoom()");
  await putAway(host, mallory);
});

test("a name changed during the match reaches the other phones", async () => {
  const host = await openRoom("Vagner");
  const ana = device("ana");
  await join(host, ana, "Ana");
  host.run("startSharedMatch()");
  await until(() => ana.run("isGuest()"), 3000, "seating");
  named(ana, "Ana Paula");
  await until(() => host.run("document.querySelector('#seat-1 .name').textContent.trim()") === "Ana Paula", 3000, "the host to see the new name");
  named(host, "V.");
  await until(() => ana.run("document.querySelector('#seat-3 .name').textContent.trim()") === "V.", 3000, "Ana to see the host's new name");
  host.run("leaveLanRoom()");
  await putAway(host, ana);
});

test("a guest whose connection drops gets its chair and its hand back by reconnecting", async () => {
  const host = await openRoom("Vagner");
  const ana = device("ana");
  await join(host, ana, "Ana");
  host.run("startSharedMatch()");
  await until(() => ana.run("isGuest()"), 3000, "seating");
  const handBefore = host.run("JSON.stringify(state.players[1].hand)");

  ana.run("lanConnection.guest.close()");
  await until(() => host.run("state.players[1].controller") === "bot", 3000, "the chair to go to a bot");
  assert.ok(chairs(host)[1].includes("Ana — away"), `the lobby keeps the chair for her: ${chairs(host)[1]}`);
  assert.equal(host.run("lanTable.seats[1].token") !== null, true);
  assert.equal(host.run("document.querySelector('#seat-1 .name').textContent.trim()"), "Cartola", "a bot plays it under its own name");

  await join(host, ana);
  await until(() => host.run("state.players[1].controller") === "guest" && ana.run("isGuest()"), 3000, "Ana to sit back down");
  assert.equal(host.run("state.players[1].name"), "Ana");
  // The host has not moved, so the bot never got to play her hand.
  assert.equal(host.run("JSON.stringify(state.players[1].hand)"), handBefore, "the same hand she left");
  await until(() => ana.run("JSON.stringify(state.players[0].hand)") === handBefore, 3000, "Ana to see her hand");
  assert.ok(host.run("[...els.lanLog.children].some(li => li.textContent === 'Ana is back at the table.')"));

  // And she can play it: the host throws, and it is her turn.
  host.run("act({ type: 'discard', tileIndex: state.players[0].hand.length - 1 })");
  for (let i = 0; i < 100 && !host.run("state.turn === 1 && state.pendingDiscard"); i++) {
    if (ana.run("state.pendingAction")) ana.run("viewerActions().find(a => a.labelKey === 'pass')?.onClick()");
    await wait(20);
  }
  const discards = host.run("state.players[1].discards.length");
  ana.run("discard(state.players[0].hand.length - 1)");
  await until(() => host.run("state.players[1].discards.length") === discards + 1, 3000, "her discard");
  host.run("leaveLanRoom()");
  await putAway(host, ana);
});

test("a phone that reconnects before the host noticed it drop takes its chair from the stale connection", async () => {
  const host = await openRoom("Vagner");
  const ana = device("ana");
  await join(host, ana, "Ana");
  host.run("startSharedMatch()");
  await until(() => ana.run("isGuest()"), 3000, "seating");
  const oldClient = host.run("state.players[1].clientId");

  // The same phone, new connection, while the old one still looks alive.
  const token = ana.run("deviceToken()");
  const anaAgain = device("ana-again", { storage: { "mahjong-vibes-device": token, "mahjong-vibes-name": "Ana" } });
  await wait(120);
  await join(host, anaAgain);
  await until(() => host.run("state.players[1].clientId") !== oldClient, 3000, "the chair to move to the new connection");
  assert.equal(host.run("state.players[1].controller"), "guest");
  await until(() => anaAgain.run("isGuest()"), 3000, "the new connection to be shown the table");

  // The stale connection can no longer act for the chair...
  host.run("act({ type: 'discard', tileIndex: state.players[0].hand.length - 1 })");
  await until(() => host.run("state.turn === 1 && state.pendingDiscard") || host.run("state.pendingAction") !== null, 3000, "the table to move");
  for (let i = 0; i < 100 && !host.run("state.turn === 1 && state.pendingDiscard"); i++) {
    if (anaAgain.run("state.pendingAction")) anaAgain.run("viewerActions().find(a => a.labelKey === 'pass')?.onClick()");
    await wait(20);
  }
  const discards = host.run("state.players[1].discards.length");
  ana.run("sendIntentToHost({ type: 'discard', tileIndex: 0 })");
  await wait(150);
  assert.equal(host.run("state.players[1].discards.length"), discards, "the old connection is ignored");
  // ...and when it finally closes, the chair does not go to a bot.
  ana.run("lanConnection.guest.close()");
  await wait(200);
  assert.equal(host.run("state.players[1].controller"), "guest");
  host.run("leaveLanRoom()");
  await putAway(host, ana, anaAgain);
});

test("someone arriving mid-match waits, then takes a free bot chair at the next hand — never a kept one", async () => {
  const host = await openRoom("Vagner");
  const ana = device("ana");
  const bia = device("bia");
  await join(host, ana, "Ana");
  await join(host, bia, "Bia");
  host.run("startSharedMatch()");
  await until(() => ana.run("isGuest()") && bia.run("isGuest()"), 3000, "seating");
  // Bia leaves; her chair (2) is kept for her. Seat 3 is a bot nobody owns.
  bia.run("lanConnection.guest.close()");
  await until(() => host.run("state.players[2].controller") === "bot", 3000, "Bia's chair to a bot");

  const caio = device("caio");
  await join(host, caio, "Caio");
  await until(() => /next hand/.test(summary(caio)), 3000, "Caio to be told he waits");
  assert.equal(caio.run("isGuest()"), false, "he is not seated mid-hand");
  assert.equal(host.run("lanTable.waiting.length"), 1);

  host.run("endDraw()");
  host.run("viewerActions().find(a => a.labelKey === 'nextHand').onClick()");
  await until(() => caio.run("isGuest()"), 3000, "Caio to be dealt in");
  assert.equal(host.run("state.players[3].name"), "Caio", "he takes the free bot chair");
  assert.equal(host.run("state.players[2].controller"), "bot", "Bia's chair is still kept for her");
  assert.ok(chairs(host)[2].includes("Bia — away"));

  // A fourth arrival finds no free chair and waits for the next match.
  const duda = device("duda");
  await join(host, duda, "Duda");
  host.run("endDraw()");
  host.run("viewerActions().find(a => a.labelKey === 'nextHand').onClick()");
  await wait(200);
  assert.equal(duda.run("isGuest()"), false);
  assert.match(summary(host), /1 waiting for a chair/);

  // A new match lets go of chairs kept for people who did not come back.
  host.run("startMatch()");
  await until(() => duda.run("isGuest()"), 3000, "Duda to get Bia's old chair");
  assert.equal(host.run("state.players[2].name"), "Duda");
  host.run("leaveLanRoom()");
  await putAway(host, ana, bia, caio, duda);
});

test("a fourth person connected before the start waits for a chair", async () => {
  const host = await openRoom("Vagner");
  const guests = ["Ana", "Bia", "Caio", "Duda"].map(name => [device(name.toLowerCase()), name]);
  for (const [guest, name] of guests) await join(host, guest, name);
  assert.match(summary(host), /4 player\(s\) connected.*1 waiting for a chair/);
  host.run("startSharedMatch()");
  await until(() => guests.slice(0, 3).every(([g]) => g.run("isGuest()")), 3000, "the first three to be seated");
  const [duda] = guests[3];
  await until(() => /next hand/.test(summary(duda)), 3000, "Duda to be told he waits");
  assert.equal(duda.run("isGuest()"), false);
  host.run("leaveLanRoom()");
  await putAway(host, ...guests.map(([g]) => g));
});
