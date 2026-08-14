// The redacted snapshot: everything one seat is allowed to know.
//
// Borrowed from miniTruco's SituacaoJogo, which exists so "a estratégia não
// trapaceie, disponibilizando apenas o que o bot vê". The same idea earns its
// keep twice here: it is what a client receives over the network, and it is the
// only shape a renderer on that client ever sees. Because it is built from the
// host's real state, anything missing here is information the client genuinely
// cannot reconstruct.

// Concealed tiles belonging to someone else become nulls rather than
// disappearing: renderHand already ignores the values and draws a back per
// entry, so a redacted hand renders correctly with no branch in the view layer.
function hiddenHand(length) {
  return Array.from({ length }, () => null);
}

function viewFor(state, seat) {
  return {
    round: state.round,
    format: state.format,
    dealer: state.dealer,
    turn: state.turn,
    // Only the count is public. The order of the remaining wall decides every
    // future draw, so it never leaves the host.
    wallCount: state.wall.length,
    wall: hiddenHand(state.wall.length),
    deadWall: [],
    doraIndicators: [...state.doraIndicators],
    callHappenedThisHand: state.callHappenedThisHand,
    discardCount: state.discardCount,
    riichiPot: state.riichiPot,
    honba: state.honba,
    drawTenpaiSeats: [...state.drawTenpaiSeats],
    lastDiscard: state.lastDiscard,
    lastDiscardFrom: state.lastDiscardFrom,
    pendingDiscard: state.pendingDiscard,
    gameOver: state.gameOver,
    matchOver: state.matchOver,
    // Messages travel as key plus params so each device renders them in its own
    // language, and so "You" resolves against the reader's seat, not the host's.
    message: "",
    messageKey: state.messageKey,
    messageParams: state.messageParams,
    win: state.win ? JSON.parse(JSON.stringify(state.win)) : null,
    claim: claimViewFor(state, seat),
    players: state.players.map((player, index) => viewPlayer(player, index === seat))
  };
}

function viewPlayer(player, isMe) {
  return {
    name: player.name,
    wind: player.wind,
    score: player.score,
    hand: isMe ? [...player.hand] : hiddenHand(player.hand.length),
    // Melds are face up on the table, ankan included: the two hidden tiles in an
    // ankan are a rendering convention, not a secret, and the hand is already
    // publicly known to contain them.
    melds: player.melds.map(meld => ({ ...meld, tiles: [...meld.tiles] })),
    discards: player.discards.map(entry => ({ ...entry })),
    riichi: player.riichi,
    riichiDeclaring: player.riichiDeclaring,
    doubleRiichi: player.doubleRiichi,
    ippatsu: player.ippatsu,
    drawnTile: isMe ? player.drawnTile : null,
    // Furiten is shown as a badge for every seat, but deciding it needs that
    // seat's concealed hand. The host resolves it to a boolean so the badge
    // survives redaction without the hand travelling with it.
    furiten: isFuriten(player),
    timeBank: player.timeBank
  };
}

// A claim window is private per seat: you are told what you may claim and that
// a window is open, never what anyone else was offered or has answered.
function claimViewFor(state, seat) {
  const claim = state.claim;
  if (!claim) return null;
  return {
    id: claim.id,
    tile: claim.tile,
    fromSeat: claim.fromSeat,
    opensAt: claim.opensAt,
    closesAt: claim.closesAt,
    eligible: claim.eligible.includes(seat) ? [seat] : [],
    options: claim.options[seat] ? { [seat]: claim.options[seat] } : {},
    responses: seat in claim.responses ? { [seat]: claim.responses[seat] } : {}
  };
}

// Structural guard, not a string search: every place a hidden tile could travel
// is checked for being genuinely empty. Counting tile names in the JSON would
// only ever be a heuristic, because melds and discards legitimately repeat them.
function viewLeaks(state, seat) {
  const view = viewFor(state, seat);
  const leaks = [];
  const isNull = value => value === null;

  if (!view.wall.every(isNull)) leaks.push("wall carries tiles");
  if (view.deadWall.length) leaks.push("deadWall is not empty");

  view.players.forEach((player, index) => {
    if (index === seat) return;
    if (!player.hand.every(isNull)) leaks.push(`seat ${index} hand carries tiles`);
    if (player.drawnTile !== null) leaks.push(`seat ${index} drawnTile is set`);
  });

  if (view.players[seat].hand.length !== state.players[seat].hand.length) {
    leaks.push("own hand was redacted");
  }
  if (view.claim) {
    const foreign = Object.keys(view.claim.options).filter(s => Number(s) !== seat);
    if (foreign.length) leaks.push(`claim options for seats ${foreign.join(",")}`);
  }
  return leaks;
}
