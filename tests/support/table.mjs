// Headless devices for testing the shared table without phones.
//
// Each device is its own jsdom window with its own origin, so its own
// localStorage, loading the real index.html, net.js and game.js. They talk over
// real WebSockets through a relay started in this process, which stands in for
// LanServerPlugin: the host's LanNet.openRoom is the only thing replaced.
// Guests join with the real LanNet.joinRoom.
import { JSDOM, VirtualConsole } from "jsdom";
import WebSocket, { WebSocketServer } from "ws";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.env.GAME_ROOT ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// The game paces itself with pauses of 400-650ms so people can follow it; a
// test has no one watching, so every pause is cut down to this.
const PACE_MS = 20;

// RELAY_LATENCY_MS slows every message to a guest, the way a busy machine or a
// real Wi-Fi does. A test that only passes when views arrive at once is reading
// a screen that has not caught up yet; run the suite with a delay to flush
// those out. Messages to one guest still arrive in the order they were sent.
const LATENCY_MS = Number(process.env.RELAY_LATENCY_MS ?? 0);

export function startRelay() {
  const server = new WebSocketServer({ port: 0, host: "127.0.0.1" });
  let host = null;
  const guests = new Map();
  let nextId = 1;
  const tellHost = event => { if (host?.readyState === 1) host.send(JSON.stringify(event)); };

  server.on("connection", (socket, request) => {
    if (request.url.startsWith("/host")) {
      host = socket;
      socket.on("message", raw => {
        const op = JSON.parse(raw.toString());
        const deliver = (id, text) => {
          const send = () => { const g = guests.get(id); if (g?.readyState === 1) g.send(text); };
          if (LATENCY_MS > 0) setTimeout(send, LATENCY_MS);
          else send();
        };
        if (op.op === "send") deliver(op.clientId, op.message);
        if (op.op === "broadcast") for (const id of guests.keys()) deliver(id, op.message);
      });
      socket.on("close", () => {
        host = null;
        for (const g of guests.values()) g.close();
      });
      return;
    }
    const clientId = String(nextId++);
    guests.set(clientId, socket);
    tellHost({ event: "peerJoined", clientId });
    socket.on("message", raw => tellHost({ event: "peerMessage", clientId, message: raw.toString() }));
    socket.on("close", () => {
      guests.delete(clientId);
      tellHost({ event: "peerLeft", clientId });
    });
  });

  return new Promise(resolve => server.on("listening", () => resolve({
    address: `127.0.0.1:${server.address().port}`,
    // ws leaves open connections alone on close, and the server will not finish
    // closing while any remain, so they are cut first.
    close: () => new Promise(done => {
      for (const client of server.clients) client.terminate();
      server.close(done);
    })
  })));
}

// What the native plugin does, done over the relay instead.
function relayHostScript(address) {
  return `
LanNet.canHost = () => true;
LanNet.openRoom = ({ port = 8787, ...handlers } = {}) => new Promise((resolve, reject) => {
  const ws = new WebSocket("ws://${address}/host");
  const text = m => typeof m === "string" ? m : JSON.stringify(m);
  ws.onopen = () => resolve({
    address: "127.0.0.1", port,
    send: (clientId, message) => { ws.send(JSON.stringify({ op: "send", clientId, message: text(message) })); return Promise.resolve(); },
    broadcast: message => { ws.send(JSON.stringify({ op: "broadcast", message: text(message) })); return Promise.resolve(); },
    close: async () => ws.close()
  });
  ws.onerror = () => reject(new Error("relay down"));
  ws.onmessage = e => {
    const ev = JSON.parse(e.data);
    if (ev.event === "peerJoined") handlers.onPeerJoined?.(ev.clientId);
    if (ev.event === "peerLeft") handlers.onPeerLeft?.(ev.clientId);
    if (ev.event === "peerMessage") {
      let m; try { m = JSON.parse(ev.message); } catch { m = ev.message; }
      handlers.onMessage?.(ev.clientId, m);
    }
  };
});

// Deals the current hand again with chosen tiles, keeping the 136-tile set
// intact: the named hands are taken from a full set first, then everything
// else is dealt from what is left. nextDraws come off the wall in order.
function rigTable({ hands = {}, nextDraws = [] }) {
  const pool = [];
  for (const t of TILE_ORDER) for (let i = 0; i < 4; i++) pool.push(t);
  const take = tile => { const i = pool.indexOf(tile); if (i < 0) throw new Error("no " + tile + " left"); pool.splice(i, 1); };
  Object.values(hands).forEach(tiles => tiles.forEach(take));
  nextDraws.forEach(take);
  const rest = shuffle(pool);
  state.players.forEach((p, seat) => {
    const size = seat === state.turn ? 14 : 13;
    const fixed = hands[seat] ? [...hands[seat]] : [];
    while (fixed.length < size) fixed.push(rest.pop());
    p.hand = fixed.sort(compareTiles);
    p.discards = []; p.melds = []; p.riichi = false; p.riichiDeclaring = false; p.ippatsu = false; p.drawnTile = null;
  });
  const mover = state.players[state.turn];
  mover.drawnTile = mover.hand[mover.hand.length - 1];
  state.deadWall = rest.splice(-14);
  state.doraIndicators = [state.deadWall[4]];
  state.wall = [...rest, ...[...nextDraws].reverse()];
  state.discardCount = 0; state.pendingAction = null; state.lastDiscard = null; state.lastDiscardFrom = null;
  state.callHappenedThisHand = false;
  render();
}`;
}

export function device(name, { relay = null, storage = {} } = {}) {
  const read = file => fs.readFileSync(path.join(ROOT, file), "utf8");
  const errors = [];
  const sockets = [];
  const consoleSink = new VirtualConsole();
  // jsdom cannot play audio; everything else it reports is a real failure.
  consoleSink.on("jsdomError", e => { if (!/Not implemented/.test(e.message)) errors.push(e.message); });
  consoleSink.on("error", (...a) => errors.push(a.map(String).join(" ")));
  const scripts = [read("net.js"), relay ? relayHostScript(relay.address) : "", read("game.js")]
    .map(code => `<script>${code.replace(/<\/script>/g, "<\\/script>")}</script>`).join("");
  const page = read("index.html").replace(/<script[\s\S]*?<\/script>/g, "").replace("</body>", `${scripts}</body>`);
  const dom = new JSDOM(page, {
    url: `http://${name}.device.test/`,
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: consoleSink,
    beforeParse(w) {
      // Node's WebSocket, not jsdom's: a closed window does not close these, so
      // each one is remembered and cut when the device is put away.
      w.WebSocket = class extends WebSocket {
        constructor(...args) { super(...args); sockets.push(this); }
      };
      w.confirm = () => true;
      // Lets a test start a device with something already saved, as if reopened.
      for (const [key, value] of Object.entries(storage)) w.localStorage.setItem(key, value);
      const realTimeout = w.setTimeout.bind(w);
      w.setTimeout = (fn, ms, ...rest) => realTimeout(fn, Math.min(ms ?? 0, PACE_MS), ...rest);
    }
  });
  return {
    name,
    errors,
    run: code => dom.window.eval(code),
    close() {
      // A closed page hears nothing more from its sockets; without this their
      // close events would still run the game's handlers against a window that
      // no longer has a document.
      sockets.forEach(socket => {
        socket.removeAllListeners();
        socket.on("error", () => {});
        socket.terminate();
      });
      dom.window.close();
    }
  };
}

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function until(check, ms, label) {
  const started = Date.now();
  while (!check()) {
    if (Date.now() - started > ms) throw new Error(`timed out: ${label}`);
    await wait(15);
  }
}

// The host opens a room, two guests join, and the host starts the match:
// guest1 at seat 1, guest2 at seat 2, a bot at seat 3. Resolves with the host
// holding the opening discard.
export async function sharedTable(relay) {
  const host = device("host", { relay });
  const guest1 = device("guest1");
  const guest2 = device("guest2");
  await wait(150);
  host.run("closeWelcome(); hostLanRoom();");
  await until(() => host.run("lanConnection?.kind") === "host", 3000, "the host's room to open");
  for (const guest of [guest1, guest2]) {
    guest.run(`els.lanAddress.value = "${relay.address}"; joinLanRoom();`);
    await until(() => guest.run("lanConnection?.kind") === "guest", 3000, `${guest.name} to join`);
  }
  await until(() => host.run("lanConnection.peers.size") === 2, 3000, "the host to see both guests");
  host.run("startSharedMatch()");
  await until(() => guest1.run("isGuest()") && guest2.run("isGuest()"), 3000, "the guests to be seated");
  await until(() => host.run("state.turn === 0 && state.pendingDiscard"), 3000, "the host's opening discard");
  return { host, guest1, guest2, devices: [host, guest1, guest2] };
}

// What a device's own player can press right now, and pressing it.
// Read back as JSON: arrays made inside a device belong to its window, and
// assert's deep equality refuses to call them equal to arrays made out here.
export const buttons = d => JSON.parse(d.run("JSON.stringify(viewerActions().map(a => a.labelKey + (a.disabled ? '(disabled)' : '')))"));
export const press = (d, key) => d.run(`(() => {
  const a = viewerActions().find(x => x.labelKey === ${JSON.stringify(key)} && !x.disabled);
  if (!a) return false;
  a.onClick();
  return true;
})()`);
export const pending = d => d.run("state.pendingAction");
