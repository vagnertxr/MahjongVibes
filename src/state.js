// The single mutable game state. The host owns this once multiplayer lands;
// clients will hold a redacted view of it instead.

// Which seat this device is playing. Single player is always seat 0; over the
// network each client gets its own, and the board is rotated so this seat still
// renders at the bottom.
let localSeat = 0;

// Seats a human is playing. Everything else is filled by a bot, and only bot
// seats take a sambista placeholder name.
let humanSeats = new Set([0]);

function isBotSeat(seat) {
  return !humanSeats.has(seat);
}

// Names supplied by the people at the table, by seat. A null entry means nobody
// claimed that seat, so it falls back to the placeholder pool in NAMES.
let seatNames = [null, null, null, null];

function seatName(seat) {
  return seatNames[seat] ?? NAMES[seat];
}

const state = {
  round: 0,
  format: "tonpuusen",
  dealer: 0,
  turn: 0,
  wall: [],
  deadWall: [],
  doraIndicators: [],
  callHappenedThisHand: false,
  discardCount: 0,
  riichiPot: 0,
  honba: 0,
  drawTenpaiSeats: [],
  lastDiscard: null,
  lastDiscardFrom: null,
  pendingDiscard: false,
  gameOver: false,
  matchOver: false,
  message: "",
  messageKey: "",
  messageParams: {},
  win: null,
  // The open claim window, or null. Only the host ever writes this.
  claim: null,
  players: []
};
