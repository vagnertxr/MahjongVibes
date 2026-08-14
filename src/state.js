// The single mutable game state. The host owns this once multiplayer lands;
// clients will hold a redacted view of it instead.

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
  players: []
};
