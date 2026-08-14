// Match and hand flow: dealing, turns, calls, scoring and the bots.

// The chosen format only commits when the match is dealt, so browsing the cards
// never disturbs a hand already in progress.
function selectFormat(format) {
  selectedFormat = normalizeFormat(format);
  els.formatCards.forEach(card => {
    const active = card.dataset.format === selectedFormat;
    card.classList.toggle("active", active);
    card.setAttribute("aria-checked", active ? "true" : "false");
  });
}

function startSelectedMatch() {
  setStoredPreference(FORMAT_STORAGE_KEY, selectedFormat);
  closeWelcome();
  startMatch();
}

function updateFormatChip() {
  els.formatLabel.textContent = t(state.format);
  els.formatLabel.title = t("formatTitle");
}

function startMatch() {
  state.format = selectedFormat;
  updateFormatChip();
  state.round = 0;
  state.dealer = 0;
  state.matchOver = false;
  // The pot and the honba count both ride across hands, so they reset per match.
  state.riichiPot = 0;
  state.honba = 0;
  state.players = [];
  startHand();
}

function startHand() {
  if (state.matchOver) {
    startMatch();
    return;
  }
  playSound("shuffle");
  state.wall = shuffle(buildWall());
  state.deadWall = state.wall.splice(-14);
  state.doraIndicators = [state.deadWall[4]];
  state.turn = state.dealer;
  state.lastDiscard = null;
  state.lastDiscardFrom = null;
  state.pendingDiscard = false;
  state.gameOver = false;
  state.win = null;
  state.callHappenedThisHand = false;
  state.discardCount = 0;
  state.drawTenpaiSeats = [];
  state.players = Array.from({ length: 4 }, (_, i) => ({
    name: seatName(i),
    wind: WINDS[(i - state.dealer + 4) % 4],
    score: state.players[i]?.score ?? 25000,
    hand: [],
    discards: [],
    melds: [],
    riichi: false,
    riichiDeclaring: false,
    doubleRiichi: false,
    ippatsu: false,
    drawnTile: null,
    // Bonus decision time, topped up per turn and capped so it cannot build up.
    timeBank: 0
  }));

  for (let draw = 0; draw < 13; draw += 1) {
    for (let seat = 0; seat < 4; seat += 1) {
      state.players[seat].hand.push(state.wall.pop());
    }
  }
  sortAllHands();
  setMessage("dealerStarts", { playerSeat: state.dealer });
  drawForTurn();
}

function sortAllHands() {
  state.players.forEach(player => player.hand.sort(compareTiles));
}

function drawForTurn() {
  if (state.wall.length === 0) {
    endDraw();
    return;
  }
  const player = state.players[state.turn];
  player.drawnTile = state.wall.pop();
  player.hand.push(player.drawnTile);
  player.hand.sort(compareTiles);
  state.pendingDiscard = true;
  setMessage("playerDraws", { playerSeat: state.turn });
  render();

  if (canWin(player.hand, player.melds.length) && checkWin(state.turn, "Tsumo", player.drawnTile)) {
    winHand(state.turn, state.turn, "Tsumo");
    return;
  }

  if (isBotSeat(state.turn)) {
    setTimeout(botDiscard, 550);
  }
}

function discardTile(seat, tileIndex) {
  if (state.gameOver || !state.pendingDiscard || seat !== state.turn) return;
  const player = state.players[seat];
  const drawnIndex = player.drawnTile !== null ? player.hand.lastIndexOf(player.drawnTile) : -1;
  if (player.riichi && !player.riichiDeclaring && tileIndex !== drawnIndex) return;
  if (player.riichi && !player.riichiDeclaring) player.ippatsu = false;
  const isTsumogiri = tileIndex === drawnIndex;
  const isRiichiTile = player.riichiDeclaring;
  const [tile] = player.hand.splice(tileIndex, 1);
  player.drawnTile = null;
  player.riichiDeclaring = false;
  state.discardCount += 1;
  player.discards.push({
    tile,
    seq: state.discardCount,
    tsumogiri: isTsumogiri,
    riichi: isRiichiTile,
    calledBy: null,
    callType: null
  });
  state.lastDiscard = tile;
  state.lastDiscardFrom = seat;
  state.pendingDiscard = false;
  playSound("discard");
  setMessage("playerDiscards", { playerSeat: seat, tile: tileText(tile) });
  render();

  // Every seat that could claim this tile is asked at once and the host resolves
  // them together; nothing advances until that window closes.
  openClaimWindow(tile, seat);
}

function findRon(tile, fromSeat, extra = {}) {
  for (let offset = 1; offset < 4; offset += 1) {
    const seat = (fromSeat + offset) % 4;
    const player = state.players[seat];
    if (!canWin([...player.hand, tile], player.melds.length)) continue;
    if (isFuriten(player)) continue;
    if (checkWin(seat, "Ron", tile, extra)) return seat;
  }
  return null;
}

// Chi may only take the discard of the player to your left. That is seat 3 when
// you are seat 0, which is what this used to hardcode; stated generally it is
// the seat three places clockwise.
function seatToMyLeft(seat) {
  return (seat + 3) % 4;
}

function canCall(seat, tile, fromSeat) {
  const player = state.players[seat];
  if (player.riichi) return false;
  const same = player.hand.filter(t => t === tile).length;
  return same >= 2 || (fromSeat === seatToMyLeft(seat) && chiOptions(player.hand, tile).length > 0);
}

function showCallActions(seat, tile, fromSeat) {
  const player = state.players[seat];
  const actions = [];
  if (player.hand.filter(t => t === tile).length >= 3) {
    actions.push({ labelKey: "kan", labelParams: { tile: tileText(tile) }, onClick: () => callMinkan(seat, tile, fromSeat) });
  }
  if (player.hand.filter(t => t === tile).length >= 2) {
    actions.push({ labelKey: "pon", onClick: () => callPon(seat, tile, fromSeat) });
  }
  if (fromSeat === seatToMyLeft(seat)) {
    for (const option of chiOptions(player.hand, tile)) {
      actions.push({ labelKey: "chi", labelParams: { tiles: option.map(tileText).join("") }, onClick: () => callChi(seat, tile, option, fromSeat) });
    }
  }
  actions.push({ labelKey: "pass", cls: "pass", onClick: nextTurn });
  showActions(actions);
}

function callPon(seat, tile, fromSeat) {
  const player = state.players[seat];
  removeTiles(player.hand, [tile, tile]);
  player.melds.push({ type: "pon", tiles: [tile, tile, tile], from: fromSeat });
  markDiscardCalled(fromSeat, seat, "pon", tile);
  state.turn = seat;
  state.pendingDiscard = true;
  state.callHappenedThisHand = true;
  breakIppatsu();
  playSound("call");
  setMessage("callPon", { playerSeat: seat, tile: tileText(tile) });
  clearActions();
  render();
}

function callChi(seat, tile, option, fromSeat) {
  const player = state.players[seat];
  removeTiles(player.hand, option);
  player.melds.push({ type: "chi", tiles: [...option, tile].sort(compareTiles), from: fromSeat });
  markDiscardCalled(fromSeat, seat, "chi", tile);
  state.turn = seat;
  state.pendingDiscard = true;
  state.callHappenedThisHand = true;
  breakIppatsu();
  playSound("call");
  setMessage("callChi", { playerSeat: seat });
  clearActions();
  render();
}

function declareAnkan(seat, tile) {
  const player = state.players[seat];
  if (state.turn !== seat || !state.pendingDiscard || !legalAnkanOptions(player).includes(tile)) return;
  removeTiles(player.hand, [tile, tile, tile, tile]);
  player.melds.push({ type: "ankan", tiles: [tile, tile, tile, tile], from: null });
  state.callHappenedThisHand = true;
  breakIppatsu();
  playSound("call");
  setMessage("declareKan", { playerSeat: seat, tile: tileText(tile) });
  revealKanDora();
  clearActions();
  if (!drawReplacementTile(player, seat)) render();
}

function declareKakan(seat, tile) {
  const player = state.players[seat];
  if (state.turn !== seat || !state.pendingDiscard || !kakanOptions(player).includes(tile)) return;
  const chankanSeat = findRon(tile, seat, { isChankan: true });
  if (chankanSeat !== null) {
    removeTiles(player.hand, [tile]);
    state.lastDiscard = tile;
    state.lastDiscardFrom = seat;
    setTimeout(() => winHand(chankanSeat, seat, "Ron", { isChankan: true }), 400);
    return;
  }
  const meld = player.melds.find(m => m.type === "pon" && m.tiles[0] === tile);
  removeTiles(player.hand, [tile]);
  meld.type = "kakan";
  meld.tiles.push(tile);
  state.callHappenedThisHand = true;
  breakIppatsu();
  playSound("call");
  setMessage("declareKan", { playerSeat: seat, tile: tileText(tile) });
  revealKanDora();
  clearActions();
  if (!drawReplacementTile(player, seat)) render();
}

function callMinkan(seat, tile, fromSeat) {
  const player = state.players[seat];
  removeTiles(player.hand, [tile, tile, tile]);
  player.melds.push({ type: "minkan", tiles: [tile, tile, tile, tile], from: fromSeat });
  markDiscardCalled(fromSeat, seat, "minkan", tile);
  state.turn = seat;
  state.callHappenedThisHand = true;
  breakIppatsu();
  playSound("call");
  setMessage("callKan", { playerSeat: seat, tile: tileText(tile) });
  revealKanDora();
  clearActions();
  if (!drawReplacementTile(player, seat)) render();
}

function drawReplacementTile(player, seat) {
  if (state.wall.length === 0) {
    endDraw();
    return true;
  }
  player.drawnTile = state.wall.pop();
  player.hand.push(player.drawnTile);
  player.hand.sort(compareTiles);
  state.pendingDiscard = true;
  if (canWin(player.hand, player.melds.length) && checkWin(seat, "Tsumo", player.drawnTile, { isRinshan: true })) {
    winHand(seat, seat, "Tsumo", { isRinshan: true });
    return true;
  }
  return false;
}

function revealKanDora() {
  const nextIndex = 4 + state.doraIndicators.length;
  if (state.deadWall[nextIndex]) state.doraIndicators.push(state.deadWall[nextIndex]);
}

function nextTurn() {
  clearActions();
  cancelClaimWindow();
  if (state.gameOver) return;
  state.turn = (state.lastDiscardFrom + 1) % 4;
  drawForTurn();
}

function botDiscard() {
  if (state.gameOver || !isBotSeat(state.turn)) return;
  const player = state.players[state.turn];
  const tile = chooseBotDiscard(player);
  const index = player.hand.indexOf(tile);
  discardTile(state.turn, index);
}

// A bot's answer to a claim window. Deterministic and deliberately cautious:
// the point is an opponent that behaves plausibly, not one that plays well.
// Returns the option it wants, or null to pass.
function botChooseClaim(seat, options) {
  const player = state.players[seat];

  // Never decline a win. claimOptionsFor only offers ron when the hand actually
  // scores, so there is nothing to weigh up.
  const ron = options.find(option => option.type === "ron");
  if (ron) return ron;

  // Open the hand only for a triplet that is worth a yaku by itself, otherwise
  // the bot trades its closed-hand value for nothing.
  const isValuable = tile => tile === "Wh" || tile === "G" || tile === "R"
    || tile === seatWindTile(seat) || tile === roundWindTile();

  const kan = options.find(option => option.type === "minkan");
  if (kan && isValuable(kan.tile)) return kan;

  const pon = options.find(option => option.type === "pon");
  if (pon && isValuable(pon.tile)) return pon;

  // Chi is the weakest call, so take it only when the hand is already open and
  // the sequence keeps it all-simples, which is the one yaku a chi can preserve.
  const alreadyOpen = player.melds.some(meld => meld.type !== "ankan");
  if (alreadyOpen) {
    const chi = options.find(option => option.type === "chi"
      && [option.tile, ...option.option].every(isSimple));
    if (chi) return chi;
  }

  return null;
}

function chooseBotDiscard(player) {
  const counts = countTiles(player.hand);
  const isolated = player.hand
    .filter(tile => counts[tile] === 1)
    .sort((a, b) => tileValue(a, player) - tileValue(b, player));
  return isolated[0] ?? player.hand.sort((a, b) => tileValue(a, player) - tileValue(b, player))[0];
}

function tileValue(tile, player) {
  let value = 0;
  if (activeDora().includes(tile)) value += 5;
  if (tile === player.wind[0] || tile === "E" || ["Wh", "G", "R"].includes(tile)) value += 2;
  if (isSuit(tile)) {
    const n = Number(tile[0]);
    if (n >= 3 && n <= 7) value += 2;
    const suit = tile[1];
    if (player.hand.includes(`${n - 1}${suit}`) || player.hand.includes(`${n + 1}${suit}`)) value += 2;
  }
  return value;
}

function discardTiles(player) {
  return player.discards.map(entry => entry.tile);
}

function lastRiverEntry(seat) {
  const river = state.players[seat]?.discards;
  return river && river.length ? river[river.length - 1] : null;
}

function markDiscardCalled(fromSeat, bySeat, callType, tile) {
  const entry = lastRiverEntry(fromSeat);
  if (!entry || entry.calledBy !== null || entry.tile !== tile) return;
  entry.calledBy = bySeat;
  entry.callType = callType;
}

function activeDora() {
  return state.doraIndicators.map(doraFromIndicator);
}

function uraDoraIndicatorsForWin() {
  const count = state.doraIndicators.length;
  const tiles = [];
  for (let i = 0; i < count; i += 1) {
    const idx = 13 - i;
    if (state.deadWall[idx] !== undefined) tiles.push(state.deadWall[idx]);
  }
  return tiles;
}

function uraDoraTilesForWin() {
  return uraDoraIndicatorsForWin().map(doraFromIndicator);
}

function isFuriten(player) {
  const waits = getWaits(player.hand, player.melds.length);
  if (waits.length === 0) return false;
  // A tile called away by someone else still furitens the player who discarded it,
  // so this deliberately ignores entry.calledBy.
  return waits.some(wait => player.discards.some(entry => entry.tile === wait));
}

function breakIppatsu() {
  state.players.forEach(p => { p.ippatsu = false; });
}

function buildWinContext(winnerSeat, type, winTile, extra = {}) {
  const player = state.players[winnerSeat];
  const isTsumo = type === "Tsumo";
  const isDealer = winnerSeat === state.dealer;
  const concealedHand = isTsumo ? player.hand : [...player.hand, winTile];
  const fullTiles = [...concealedHand, ...player.melds.flatMap(m => m.tiles)];
  const openingTurn = state.players.every(p => p.discards.length === 0) && !state.callHappenedThisHand;
  return {
    winTile,
    isTsumo,
    isDealer,
    seatWindTile: seatWindTile(winnerSeat),
    roundWindTile: roundWindTile(),
    isRiichi: player.riichi,
    isDoubleRiichi: !!player.doubleRiichi,
    isIppatsu: !!player.ippatsu,
    doraCount: countMatchingTiles(fullTiles, activeDora()),
    uraDoraCount: player.riichi ? countMatchingTiles(fullTiles, uraDoraTilesForWin()) : 0,
    isHaitei: isTsumo && state.wall.length === 0 && !extra.isRinshan,
    isHoutei: !isTsumo && state.wall.length === 0,
    isRinshan: !!extra.isRinshan,
    isChankan: !!extra.isChankan,
    isTenhou: isTsumo && isDealer && openingTurn,
    isChiihou: isTsumo && !isDealer && openingTurn
  };
}

function checkWin(seat, type, winTile, extra = {}) {
  const player = state.players[seat];
  const context = buildWinContext(seat, type, winTile, extra);
  const concealedHand = context.isTsumo ? player.hand : [...player.hand, winTile];
  return evaluateWin(concealedHand, player.melds, context);
}

function winHand(winner, loser, type, extra = {}) {
  cancelClaimWindow();
  const player = state.players[winner];
  const winTile = type === "Ron" ? state.lastDiscard : player.drawnTile;
  const evaluation = checkWin(winner, type, winTile, extra);
  if (!evaluation) return;

  state.gameOver = true;
  clearActions();
  const revealedHand = [...player.hand];
  if (type === "Ron") revealedHand.push(winTile);
  revealedHand.sort(compareTiles);
  state.win = {
    winner,
    type,
    tile: winTile,
    hand: revealedHand,
    melds: player.melds.map(meld => [...meld.tiles]),
    evaluation
  };

  const points = evaluation.points;
  if (type === "Tsumo") {
    state.players.forEach((p, i) => {
      if (i === winner) return;
      const isDealerPayer = winner !== state.dealer && i === state.dealer;
      p.score -= isDealerPayer ? evaluation.score.dealerPay : evaluation.score.otherPay;
    });
  } else {
    state.players[loser].score -= points;
  }
  player.score += points;

  // Honba is worth 300 a count on top of the hand: the discarder covers all of
  // it on a ron, the three payers split it 100 each on a tsumo. Read before
  // finishHand, which is what resets the counter.
  const honbaBonus = state.honba * 300;
  if (honbaBonus > 0) {
    if (type === "Tsumo") {
      const each = state.honba * 100;
      state.players.forEach((p, i) => { if (i !== winner) p.score -= each; });
    } else {
      state.players[loser].score -= honbaBonus;
    }
    player.score += honbaBonus;
  }

  // The winner sweeps the riichi sticks on the table.
  player.score += state.riichiPot;
  state.riichiPot = 0;

  playSound("win");
  setMessage("wins", { winner, type, points });
  finishHand(winner === state.dealer);
  render();
}

function describeWin(player) {
  if (!state.win?.evaluation) return t("standardHand");
  const { evaluation } = state.win;
  const names = evaluation.yakuList.map(yakuDisplayName).join(", ");
  if (evaluation.isYakuman) return names;
  return `${names} (${evaluation.han}han ${evaluation.fu}fu)`;
}

function endDraw() {
  cancelClaimWindow();
  state.gameOver = true;
  const tenpaiSeats = state.players
    .map((player, seat) => ({ seat, tenpai: isTenpai(player.hand, player.melds.length) }))
    .filter(entry => entry.tenpai)
    .map(entry => entry.seat);
  applyNotenPayments(tenpaiSeats);
  state.drawTenpaiSeats = tenpaiSeats;
  setMessage("exhaustiveDraw");
  finishHand(tenpaiSeats.includes(state.dealer), true);
  render();
}

function applyNotenPayments(tenpaiSeats) {
  const tenpaiCount = tenpaiSeats.length;
  if (tenpaiCount === 0 || tenpaiCount === 4) return;
  const pot = 3000;
  const gain = pot / tenpaiCount;
  const notenSeats = [0, 1, 2, 3].filter(seat => !tenpaiSeats.includes(seat));
  const loss = pot / notenSeats.length;
  tenpaiSeats.forEach(seat => { state.players[seat].score += gain; });
  notenSeats.forEach(seat => { state.players[seat].score -= loss; });
}

// A honba is counted when the dealer repeats and after any exhaustive draw,
// including one where the dealer was noten and the seat still passes. Only a
// non-dealer win clears it.
function finishHand(dealerRepeats, isDraw = false) {
  if (dealerRepeats || isDraw) state.honba += 1;
  else state.honba = 0;
  const completedRound = state.round;
  if (!dealerRepeats) {
    state.round += 1;
    state.dealer = state.round % 4;
  }
  if (isMatchComplete(dealerRepeats)) {
    state.matchOver = true;
    const leader = leadingPlayerSeat();
    setMessage("matchComplete", {
      winner: leader,
      formatKey: state.format,
      roundNumber: completedRound
    });
  }
}

function isMatchComplete(dealerRepeats) {
  if (state.players.some(player => player.score < 0)) return true;
  const scheduledRounds = MATCH_FORMATS[state.format].rounds;
  const leader = leadingPlayerSeat();
  const scheduledEndReached = state.round >= scheduledRounds
    || (dealerRepeats && state.round >= scheduledRounds - 1 && leader === state.dealer);
  if (!scheduledEndReached) return false;
  return state.players[leader].score >= 30000;
}

function leadingPlayerSeat() {
  return state.players
    .map((player, seat) => ({ seat, score: player.score }))
    .sort((a, b) => b.score - a.score || a.seat - b.seat)[0].seat;
}

function declareTsumo(seat) {
  const player = state.players[seat];
  if (state.turn !== seat || !state.pendingDiscard || state.gameOver) return;
  if (!canWin(player.hand, player.melds.length)) return;
  if (!checkWin(seat, "Tsumo", player.drawnTile)) return;
  winHand(seat, seat, "Tsumo");
}

function declareRiichi(seat) {
  const player = state.players[seat];
  if (state.turn !== seat || !state.pendingDiscard || player.melds.length > 0 || player.score < 1000) return;
  if (state.wall.length < 4) return;
  if (!canDeclareRiichi(player.hand, player.melds.length)) return;
  player.riichi = true;
  player.riichiDeclaring = true;
  player.doubleRiichi = player.discards.length === 0 && !state.callHappenedThisHand;
  player.ippatsu = true;
  player.score -= 1000;
  state.riichiPot += 1000;
  playSound("riichi");
  setMessage("declareRiichi", { playerSeat: seat });
  render();
}
