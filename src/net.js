// Transport and the host/client split.
//
// Following miniTruco: the host runs the ordinary local match, unchanged, and a
// remote player is just a seat whose decisions arrive from somewhere else. A
// client runs no rules at all -- it draws the redacted view the host sends and
// forwards what its player clicks. That is why single player keeps working
// untouched: it is the host path with nobody connected.

const NET_ROLE = { SOLO: "solo", HOST: "host", CLIENT: "client" };

const net = {
  role: NET_ROLE.SOLO,
  transport: null,
  roomCode: null,
  // Host bookkeeping: which peer id sits where, and the names they gave.
  seatPeers: [null, null, null, null],
  // Client bookkeeping.
  peerId: null,
  seq: 0
};

function isHost() { return net.role === NET_ROLE.HOST; }
function isClient() { return net.role === NET_ROLE.CLIENT; }
function isNetworked() { return net.role !== NET_ROLE.SOLO; }

// Four same-origin tabs can play with no server at all, which is how the whole
// engine gets exercised before any of it has to survive a real network. The
// WebSocket transport implements the same three methods.
function createBroadcastTransport(roomCode) {
  const channel = new BroadcastChannel(`mahjong-vibes:${roomCode}`);
  const handlers = [];
  channel.onmessage = event => handlers.forEach(fn => fn(event.data));
  return {
    kind: "broadcast",
    send(message) { channel.postMessage(message); },
    onMessage(fn) { handlers.push(fn); },
    close() { channel.close(); }
  };
}

// A room code has to survive being read aloud across a table, so it avoids the
// characters people confuse: no O/0, no I/1.
const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateRoomCode(length = 4) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return [...bytes].map(b => ROOM_CODE_ALPHABET[b % ROOM_CODE_ALPHABET.length]).join("");
}

function netSend(message) {
  if (!net.transport) return;
  net.transport.send({ ...message, seq: ++net.seq, room: net.roomCode });
}

// --- Host ---------------------------------------------------------------

function hostRoom(code, myName) {
  net.role = NET_ROLE.HOST;
  net.roomCode = code || generateRoomCode();
  net.transport = createBroadcastTransport(net.roomCode);
  net.seatPeers = [null, null, null, null];
  localSeat = 0;
  humanSeats = new Set([0]);
  seatNames = [myName || null, null, null, null];
  net.transport.onMessage(onHostMessage);
  return net.roomCode;
}

function onHostMessage(message) {
  if (!isHost() || message.room !== net.roomCode) return;
  if (message.t === "join") return hostSeatPlayer(message.peerId, message.name);
  if (message.t === "action") return hostApplyAction(message.seat, message.action);
}

function hostSeatPlayer(peerId, name) {
  const existing = net.seatPeers.indexOf(peerId);
  const seat = existing >= 0 ? existing : net.seatPeers.findIndex((p, i) => p === null && i !== 0);
  if (seat < 0) {
    netSend({ t: "roomFull", peerId });
    return;
  }
  net.seatPeers[seat] = peerId;
  seatNames[seat] = name || null;
  humanSeats.add(seat);
  // A seat that was being played by a bot takes the new player's name from the
  // next hand; renaming mid-hand would be more confusing than waiting.
  if (state.players[seat]) state.players[seat].name = seatName(seat);
  netSend({ t: "seated", peerId, seat, names: [0, 1, 2, 3].map(seatName) });
  render();
}

// Everything a remote player can ask for. The host validates by simply running
// the same functions the local player runs; an illegal request fails the same
// guards and changes nothing.
function hostApplyAction(seat, action) {
  if (!isHost() || !Number.isInteger(seat)) return;
  if (action.type === "discard") return hostApplyDiscard(seat, action);
  if (action.type === "claim") return submitClaim(seat, action.choice);
  if (action.type === "riichi") return declareRiichi(seat);
  if (action.type === "tsumo") return declareTsumo(seat);
  if (action.type === "ankan") return declareAnkan(seat, action.tile);
  if (action.type === "kakan") return declareKakan(seat, action.tile);
  if (action.type === "nextHand") return startHand();
}

// A discard travels as a tile, never as a hand index: the two sides sort
// independently, and an index that shifted would silently discard the wrong
// tile. fromDrawn disambiguates when the hand holds more than one copy.
function hostApplyDiscard(seat, action) {
  const player = state.players[seat];
  if (!player) return;
  const drawnIndex = player.drawnTile !== null ? player.hand.lastIndexOf(player.drawnTile) : -1;
  const index = action.fromDrawn && drawnIndex >= 0 && player.hand[drawnIndex] === action.tile
    ? drawnIndex
    : player.hand.indexOf(action.tile);
  if (index < 0) return;
  discardTile(seat, index);
}

// The host's pulse: every seat gets its own view after every change. Called from
// render(), which already runs after every mutation.
function hostBroadcast() {
  if (!isHost()) return;
  net.seatPeers.forEach((peerId, seat) => {
    if (peerId) netSend({ t: "view", peerId, seat, view: viewFor(state, seat) });
  });
}

// --- Client -------------------------------------------------------------

function joinRoom(code, myName) {
  net.role = NET_ROLE.CLIENT;
  net.roomCode = code;
  net.peerId = generateRoomCode(8);
  net.transport = createBroadcastTransport(code);
  net.transport.onMessage(onClientMessage);
  netSend({ t: "join", peerId: net.peerId, name: myName || null });
}

function onClientMessage(message) {
  if (!isClient() || message.room !== net.roomCode) return;
  if (message.peerId !== net.peerId) return;
  if (message.t === "seated") {
    localSeat = message.seat;
    seatNames = message.names;
    return;
  }
  if (message.t === "view") applyView(message.seat, message.view);
}

// The client holds no game state of its own: it overwrites what it has with the
// snapshot it was sent. state stays the same object so every renderer keeps
// working, but on a client nothing ever writes to it except this.
function applyView(seat, view) {
  localSeat = seat;
  Object.assign(state, view);
  // Rendered locally so each device reads its own language, and so "You"
  // resolves against the reader rather than the host.
  state.message = view.messageKey ? formatMessage(view.messageKey, view.messageParams) : "";
  render();
}

function sendAction(action) {
  netSend({ t: "action", seat: localSeat, action });
}

// --- Shared entry point -------------------------------------------------

// Every player action funnels through here. On a client it goes on the wire; on
// a host or in single player it runs directly. Keeping one door means a new
// action cannot accidentally work locally but not remotely.
function submitPlayerAction(action) {
  if (isClient()) {
    sendAction(action);
    clearActions();
    return true;
  }
  hostApplyAction(localSeat, action);
  return true;
}
