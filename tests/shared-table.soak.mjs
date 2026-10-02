// Plays whole shared matches at random and watches the table the entire time.
// Slower than the scenarios and not deterministic, so it is not part of
// `npm test`: run it with `npm run test:soak` after touching the network code.
//
// Every tick it checks that tiles are conserved on the host, that no guest's
// view carries anything it should not, and that a guest that has caught up
// sees exactly the host's table turned to face it. Partway through, one guest
// drops out at a hard moment and the table has to carry on without it.
import { startRelay, sharedTable, wait } from "./support/table.mjs";

const HANDS = Number(process.env.HANDS ?? 6);
const POLICY = process.env.POLICY ?? "open";           // "closed" never calls, so riichi and wins come up
const DROP_MODE = process.env.DROP_MODE ?? "offer";     // "turn", "offer" or "any"
const DEADLINE_MS = 180000;

const DRIVER = `(() => {
  const closed = ${JSON.stringify(POLICY)} === "closed";
  const actions = viewerActions().filter(a => !a.disabled);
  const has = key => actions.some(a => a.labelKey === key);
  const take = key => { actions.find(a => a.labelKey === key).onClick(); return key; };
  if (state.gameOver) return isGuest() || state.matchOver ? null : take("nextHand");
  if (has("ron")) return take("ron");
  if (has("tsumo")) return take("tsumo");
  if (has("pass")) {
    const roll = Math.random();
    if (!closed && has("kan") && roll < 0.6) return take("kan");
    if (!closed && has("pon") && roll < 0.5) return take("pon");
    if (!closed && has("chi") && roll < 0.35) return take("chi");
    return take("pass");
  }
  if (has("riichi") && (closed || Math.random() < 0.7)) return take("riichi");
  if (has("kan") && Math.random() < 0.6) return take("kan");
  if (state.turn === 0 && state.pendingDiscard) {
    const me = state.players[0];
    let index = me.hand.lastIndexOf(me.drawnTile);
    if (!(me.riichi && !me.riichiDeclaring)) index = me.hand.indexOf(chooseBotDiscard({ ...me, hand: [...me.hand] }));
    discard(index);
    return "discard";
  }
  return null;
})()`;

const problems = [];
const note = (kind, detail) => { if (problems.length < 20) problems.push({ kind, detail }); };

function checkHost(host) {
  const s = host.run("state");
  if (s.gameOver || s.pendingAction?.type === "awaitingChankan") return;
  let tiles = s.wall.length + s.deadWall.length;
  for (const p of s.players) {
    tiles += p.hand.length + p.melds.reduce((n, m) => n + m.tiles.length, 0) + p.discards.filter(d => d.calledBy === null).length;
  }
  if (tiles !== 136) note("conservation", tiles);
}

function checkGuest(host, guest) {
  if (!guest.run("isGuest()")) return;
  const view = guest.run("state");
  view.players.forEach((p, i) => {
    if (i !== 0 && (p.hand.some(t => t !== null) || p.drawnTile !== null)) note("leak", `${guest.name} sees seat ${i}'s tiles`);
    if (p.clientId) note("leak", `${guest.name} sees a clientId`);
  });
  if (view.wall.some(t => t !== null) || view.deadWall.some(t => t !== null)) note("leak", `${guest.name} sees the wall`);
  const pa = view.pendingAction;
  if (pa && !((pa.type === "awaitingHumanRon" && pa.winner === 0) || (pa.type === "awaitingHumanCall" && pa.seat === 0))) {
    note("leak", `${guest.name} sees someone else's ${pa.type}`);
  }
  if (guest.run("guestTable.lastSeq") !== host.run("viewSeq")) return;
  const h = host.run("state");
  const seat = h.players.findIndex(p => p.clientId === guest.clientId);
  if (seat < 0) return;
  const turned = v => (Number.isInteger(v) ? (v - seat + 4) % 4 : v);
  const at = i => h.players[(i + seat) % 4];
  if (JSON.stringify(view.players[0].hand) !== JSON.stringify(h.players[seat].hand)) note("mismatch", `${guest.name} own hand`);
  if (view.turn !== turned(h.turn)) note("mismatch", `${guest.name} turn`);
  if (view.players.some((p, i) => p.score !== at(i).score || p.discards.length !== at(i).discards.length || p.hand.length !== at(i).hand.length)) {
    note("mismatch", `${guest.name} scores, rivers or hand sizes`);
  }
}

function hardMoment(host, guest) {
  const seat = host.run(`state.players.findIndex(p => p.clientId === "${guest.clientId}")`);
  const pa = host.run("state.pendingAction");
  if (host.run("state.discardCount") < 6) return false;
  if (DROP_MODE === "turn") return host.run(`state.turn === ${seat} && state.pendingDiscard`);
  if (DROP_MODE === "offer") return pa?.seat === seat || pa?.winner === seat;
  return true;
}

const relay = await startRelay();
const table = await sharedTable(relay);
const { host, guest1, guest2 } = table;
guest1.clientId = host.run("state.players[1].clientId");
guest2.clientId = host.run("state.players[2].clientId");

const results = [];
const tally = {};
let lastHand = "";
let lastSignature = "";
let stillTicks = 0;
const started = Date.now();
while (results.length < HANDS && Date.now() - started < DEADLINE_MS) {
  const h = host.run("({ over: state.gameOver, matchOver: state.matchOver, win: state.win, round: state.round, honba: state.honba, dc: state.discardCount, turn: state.turn, p: state.pendingAction?.type })");
  if (h.over) {
    const key = `${h.round}/${h.honba}/${h.dc}/${h.win?.winner}`;
    if (key !== lastHand) { lastHand = key; results.push(h.win ? `${h.win.type} by seat ${h.win.winner}` : "draw"); }
    if (h.matchOver) break;
  } else if (results.length >= 1 && !guest2.dropped && hardMoment(host, guest2)) {
    const seat = host.run(`state.players.findIndex(p => p.clientId === "${guest2.clientId}")`);
    guest2.run("lanConnection.guest.close()");
    guest2.dropped = true;
    await wait(200);
    if (host.run(`state.players[${seat}].controller`) !== "bot") note("drop", "seat not handed to a bot");
  }
  for (const d of table.devices) {
    if (d.dropped) continue;
    const did = d.run(DRIVER);
    if (did) tally[did] = (tally[did] ?? 0) + 1;
  }
  checkHost(host);
  for (const g of [guest1, guest2]) if (!g.dropped) checkGuest(host, g);
  const signature = `${h.dc}|${h.turn}|${h.p}|${h.over}`;
  if (signature === lastSignature && !h.over) {
    if (++stillTicks > 300) { note("stall", h); break; }
  } else { stillTicks = 0; lastSignature = signature; }
  await wait(5);
}

for (const d of table.devices) if (d.errors.length) note("script error", { device: d.name, errors: d.errors.slice(0, 3) });
console.log(JSON.stringify({ hands: results, actions: tally, guestDropped: !!guest2.dropped, problems }, null, 2));
table.devices.forEach(d => d.close());
await relay.close();
process.exit(problems.length ? 1 : 0);
