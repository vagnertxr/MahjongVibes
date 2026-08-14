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
    name: NAMES[i],
    wind: WINDS[(i - state.dealer + 4) % 4],
    score: state.players[i]?.score ?? 25000,
    hand: [],
    discards: [],
    melds: [],
    riichi: false,
    riichiDeclaring: false,
    doubleRiichi: false,
    ippatsu: false,
    drawnTile: null
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

  if (state.turn !== 0) {
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

  const ronSeat = findRon(tile, seat);
  if (ronSeat !== null) {
    if (ronSeat === 0) {
      showActions([
        { labelKey: "ron", cls: "win", onClick: () => winHand(0, seat, "Ron") },
        { labelKey: "pass", cls: "pass", onClick: nextTurn }
      ]);
      return;
    }
    setTimeout(() => winHand(ronSeat, seat, "Ron"), 650);
    return;
  }

  if (seat !== 0 && canHumanCall(tile, seat)) {
    showCallActions(tile, seat);
    return;
  }

  setTimeout(nextTurn, 450);
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

function canHumanCall(tile, fromSeat) {
  const human = state.players[0];
  if (human.riichi) return false;
  const same = human.hand.filter(t => t === tile).length;
  return same >= 2 || (fromSeat === 3 && chiOptions(human.hand, tile).length > 0);
}

function showCallActions(tile, fromSeat) {
  const human = state.players[0];
  const actions = [];
  if (human.hand.filter(t => t === tile).length >= 3) {
    actions.push({ labelKey: "kan", labelParams: { tile: tileText(tile) }, onClick: () => callMinkan(tile, fromSeat) });
  }
  if (human.hand.filter(t => t === tile).length >= 2) {
    actions.push({ labelKey: "pon", onClick: () => callPon(tile, fromSeat) });
  }
  for (const option of chiOptions(human.hand, tile)) {
    actions.push({ labelKey: "chi", labelParams: { tiles: option.map(tileText).join("") }, onClick: () => callChi(tile, option, fromSeat) });
  }
  actions.push({ labelKey: "pass", cls: "pass", onClick: nextTurn });
  showActions(actions);
}

function callPon(tile, fromSeat) {
  const human = state.players[0];
  removeTiles(human.hand, [tile, tile]);
  human.melds.push({ type: "pon", tiles: [tile, tile, tile], from: fromSeat });
  // The caller is always the human today; pass the caller seat once bots learn to call.
  markDiscardCalled(fromSeat, 0, "pon", tile);
  state.turn = 0;
  state.pendingDiscard = true;
  state.callHappenedThisHand = true;
  breakIppatsu();
  playSound("call");
  setMessage("callPon", { tile: tileText(tile) });
  clearActions();
  render();
}

function callChi(tile, option, fromSeat) {
  const human = state.players[0];
  removeTiles(human.hand, option);
  human.melds.push({ type: "chi", tiles: [...option, tile].sort(compareTiles), from: fromSeat });
  markDiscardCalled(fromSeat, 0, "chi", tile);
  state.turn = 0;
  state.pendingDiscard = true;
  state.callHappenedThisHand = true;
  breakIppatsu();
  playSound("call");
  setMessage("callChi");
  clearActions();
  render();
}

function declareAnkan(tile) {
  const human = state.players[0];
  if (state.turn !== 0 || !state.pendingDiscard || !legalAnkanOptions(human).includes(tile)) return;
  removeTiles(human.hand, [tile, tile, tile, tile]);
  human.melds.push({ type: "ankan", tiles: [tile, tile, tile, tile], from: null });
  state.callHappenedThisHand = true;
  breakIppatsu();
  playSound("call");
  setMessage("declareKan", { tile: tileText(tile) });
  revealKanDora();
  clearActions();
  if (!drawReplacementTile(human, 0)) render();
}

function declareKakan(tile) {
  const human = state.players[0];
  if (state.turn !== 0 || !state.pendingDiscard || !kakanOptions(human).includes(tile)) return;
  const chankanSeat = findRon(tile, 0, { isChankan: true });
  if (chankanSeat !== null) {
    removeTiles(human.hand, [tile]);
    state.lastDiscard = tile;
    state.lastDiscardFrom = 0;
    setTimeout(() => winHand(chankanSeat, 0, "Ron", { isChankan: true }), 400);
    return;
  }
  const meld = human.melds.find(m => m.type === "pon" && m.tiles[0] === tile);
  removeTiles(human.hand, [tile]);
  meld.type = "kakan";
  meld.tiles.push(tile);
  state.callHappenedThisHand = true;
  breakIppatsu();
  playSound("call");
  setMessage("declareKan", { tile: tileText(tile) });
  revealKanDora();
  clearActions();
  if (!drawReplacementTile(human, 0)) render();
}

function callMinkan(tile, fromSeat) {
  const human = state.players[0];
  removeTiles(human.hand, [tile, tile, tile]);
  human.melds.push({ type: "minkan", tiles: [tile, tile, tile, tile], from: fromSeat });
  markDiscardCalled(fromSeat, 0, "minkan", tile);
  state.turn = 0;
  state.callHappenedThisHand = true;
  breakIppatsu();
  playSound("call");
  setMessage("callKan", { tile: tileText(tile) });
  revealKanDora();
  clearActions();
  if (!drawReplacementTile(human, 0)) render();
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
  if (state.gameOver) return;
  state.turn = (state.lastDiscardFrom + 1) % 4;
  drawForTurn();
}

function botDiscard() {
  if (state.gameOver || state.turn === 0) return;
  const player = state.players[state.turn];
  const tile = chooseBotDiscard(player);
  const index = player.hand.indexOf(tile);
  discardTile(state.turn, index);
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

function declareRiichi() {
  const human = state.players[0];
  if (state.turn !== 0 || !state.pendingDiscard || human.melds.length > 0 || human.score < 1000) return;
  if (state.wall.length < 4) return;
  if (!canDeclareRiichi(human.hand, human.melds.length)) return;
  human.riichi = true;
  human.riichiDeclaring = true;
  human.doubleRiichi = human.discards.length === 0 && !state.callHappenedThisHand;
  human.ippatsu = true;
  human.score -= 1000;
  state.riichiPot += 1000;
  playSound("riichi");
  setMessage("declareRiichi");
  render();
}
