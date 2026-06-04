const SUITS = ["m", "p", "s"];
const WINDS = ["East", "South", "West", "North"];
const HONORS = ["E", "S", "W", "N", "Wh", "G", "R"];
const NAMES = ["You", "Mika", "Ren", "Aoi"];
const TILE_ORDER = [
  "1m","2m","3m","4m","5m","6m","7m","8m","9m",
  "1p","2p","3p","4p","5p","6p","7p","8p","9p",
  "1s","2s","3s","4s","5s","6s","7s","8s","9s",
  "E","S","W","N","Wh","G","R"
];
const TILE_LABELS = {
  E: "東", S: "南", W: "西", N: "北", Wh: "白", G: "發", R: "中"
};
const state = {
  round: 0,
  dealer: 0,
  turn: 0,
  wall: [],
  deadWall: [],
  dora: "",
  lastDiscard: null,
  lastDiscardFrom: null,
  pendingDiscard: false,
  gameOver: false,
  message: "",
  players: []
};

const els = {
  roundLabel: document.querySelector("#roundLabel"),
  wallCount: document.querySelector("#wallCount"),
  doraIndicator: document.querySelector("#doraIndicator"),
  lastDiscard: document.querySelector("#lastDiscard"),
  statusText: document.querySelector("#statusText"),
  actionBar: document.querySelector("#actionBar"),
  newGameBtn: document.querySelector("#newGameBtn"),
  seats: Array.from({ length: 4 }, (_, i) => document.querySelector(`#seat-${i}`))
};

els.newGameBtn.addEventListener("click", startHand);

function startHand() {
  state.wall = shuffle(buildWall());
  state.deadWall = state.wall.splice(-14);
  state.dora = state.deadWall[4];
  state.turn = state.dealer;
  state.lastDiscard = null;
  state.lastDiscardFrom = null;
  state.pendingDiscard = false;
  state.gameOver = false;
  state.players = Array.from({ length: 4 }, (_, i) => ({
    name: NAMES[i],
    wind: WINDS[(i - state.dealer + 4) % 4],
    score: state.players[i]?.score ?? 25000,
    hand: [],
    discards: [],
    melds: [],
    riichi: false,
    ippatsu: false,
    drawnTile: null
  }));

  for (let draw = 0; draw < 13; draw += 1) {
    for (let seat = 0; seat < 4; seat += 1) {
      state.players[seat].hand.push(state.wall.pop());
    }
  }
  sortAllHands();
  state.message = `${state.players[state.dealer].name} deals. Draw and discard to chase Mahjong Vibes.`;
  drawForTurn();
}

function buildWall() {
  const wall = [];
  for (const tile of TILE_ORDER) {
    for (let i = 0; i < 4; i += 1) wall.push(tile);
  }
  return wall;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sortAllHands() {
  state.players.forEach(player => player.hand.sort(compareTiles));
}

function compareTiles(a, b) {
  return TILE_ORDER.indexOf(a) - TILE_ORDER.indexOf(b);
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
  state.message = `${player.name} draws.`;
  render();

  if (canWin(player.hand, player.melds.length)) {
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
  const [tile] = player.hand.splice(tileIndex, 1);
  player.drawnTile = null;
  player.discards.push(tile);
  state.lastDiscard = tile;
  state.lastDiscardFrom = seat;
  state.pendingDiscard = false;
  state.message = `${player.name} discards ${tileText(tile)}.`;
  render();

  const ronSeat = findRon(tile, seat);
  if (ronSeat !== null) {
    if (ronSeat === 0) {
      showActions([
        { label: "Ron", cls: "win", onClick: () => winHand(0, seat, "Ron") },
        { label: "Pass", cls: "pass", onClick: nextTurn }
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

function findRon(tile, fromSeat) {
  for (let offset = 1; offset < 4; offset += 1) {
    const seat = (fromSeat + offset) % 4;
    const player = state.players[seat];
    if (canWin([...player.hand, tile], player.melds.length)) return seat;
  }
  return null;
}

function canHumanCall(tile, fromSeat) {
  const human = state.players[0];
  const same = human.hand.filter(t => t === tile).length;
  return same >= 2 || (fromSeat === 3 && chiOptions(human.hand, tile).length > 0);
}

function showCallActions(tile, fromSeat) {
  const human = state.players[0];
  const actions = [];
  if (human.hand.filter(t => t === tile).length >= 2) {
    actions.push({ label: "Pon", onClick: () => callPon(tile, fromSeat) });
  }
  for (const option of chiOptions(human.hand, tile)) {
    actions.push({ label: `Chi ${option.map(tileText).join("")}`, onClick: () => callChi(tile, option, fromSeat) });
  }
  actions.push({ label: "Pass", cls: "pass", onClick: nextTurn });
  showActions(actions);
}

function callPon(tile, fromSeat) {
  const human = state.players[0];
  removeTiles(human.hand, [tile, tile]);
  human.melds.push({ type: "pon", tiles: [tile, tile, tile], from: fromSeat });
  state.turn = 0;
  state.pendingDiscard = true;
  state.message = `You call Pon on ${tileText(tile)}. Discard a tile.`;
  clearActions();
  render();
}

function callChi(tile, option, fromSeat) {
  const human = state.players[0];
  removeTiles(human.hand, option);
  human.melds.push({ type: "chi", tiles: [...option, tile].sort(compareTiles), from: fromSeat });
  state.turn = 0;
  state.pendingDiscard = true;
  state.message = `You call Chi. Discard a tile.`;
  clearActions();
  render();
}

function chiOptions(hand, tile) {
  if (!isSuit(tile)) return [];
  const n = Number(tile[0]);
  const suit = tile[1];
  const options = [
    [n - 2, n - 1],
    [n - 1, n + 1],
    [n + 1, n + 2]
  ];
  return options
    .filter(seq => seq.every(x => x >= 1 && x <= 9))
    .map(seq => seq.map(x => `${x}${suit}`))
    .filter(seq => seq.every(t => hand.includes(t)));
}

function removeTiles(hand, tiles) {
  for (const tile of tiles) {
    const index = hand.indexOf(tile);
    if (index >= 0) hand.splice(index, 1);
  }
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
  if (tile === state.dora) value += 5;
  if (tile === player.wind[0] || tile === "E" || ["Wh", "G", "R"].includes(tile)) value += 2;
  if (isSuit(tile)) {
    const n = Number(tile[0]);
    if (n >= 3 && n <= 7) value += 2;
    const suit = tile[1];
    if (player.hand.includes(`${n - 1}${suit}`) || player.hand.includes(`${n + 1}${suit}`)) value += 2;
  }
  return value;
}

function countTiles(hand) {
  return hand.reduce((acc, tile) => {
    acc[tile] = (acc[tile] ?? 0) + 1;
    return acc;
  }, {});
}

function canWin(tiles, openMeldCount) {
  const neededGroups = 4 - openMeldCount;
  if (tiles.length !== neededGroups * 3 + 2) return false;
  if (isSevenPairs(tiles) && openMeldCount === 0) return true;
  const counts = countTiles(tiles);
  for (const pair of Object.keys(counts)) {
    if (counts[pair] < 2) continue;
    counts[pair] -= 2;
    if (canMakeGroups(counts, neededGroups)) {
      counts[pair] += 2;
      return true;
    }
    counts[pair] += 2;
  }
  return false;
}

function isSevenPairs(tiles) {
  if (tiles.length !== 14) return false;
  return Object.values(countTiles(tiles)).filter(n => n === 2).length === 7;
}

function canMakeGroups(counts, groupsLeft) {
  if (groupsLeft === 0) return Object.values(counts).every(n => n === 0);
  const tile = TILE_ORDER.find(t => counts[t] > 0);
  if (!tile) return false;

  if (counts[tile] >= 3) {
    counts[tile] -= 3;
    if (canMakeGroups(counts, groupsLeft - 1)) {
      counts[tile] += 3;
      return true;
    }
    counts[tile] += 3;
  }

  if (isSuit(tile)) {
    const n = Number(tile[0]);
    const suit = tile[1];
    const t2 = `${n + 1}${suit}`;
    const t3 = `${n + 2}${suit}`;
    if (n <= 7 && counts[t2] > 0 && counts[t3] > 0) {
      counts[tile] -= 1;
      counts[t2] -= 1;
      counts[t3] -= 1;
      if (canMakeGroups(counts, groupsLeft - 1)) {
        counts[tile] += 1;
        counts[t2] += 1;
        counts[t3] += 1;
        return true;
      }
      counts[tile] += 1;
      counts[t2] += 1;
      counts[t3] += 1;
    }
  }

  return false;
}

function winHand(winner, loser, type) {
  state.gameOver = true;
  clearActions();
  const player = state.players[winner];
  const base = type === "Tsumo" ? 1500 : 3900;
  const bonus = player.riichi ? 1000 : 0;
  const doraBonus = countTiles(player.hand)[state.dora] ? 1000 : 0;
  const points = base + bonus + doraBonus;

  if (type === "Tsumo") {
    state.players.forEach((p, i) => {
      if (i !== winner) p.score -= Math.floor(points / 3);
    });
    player.score += points;
  } else {
    state.players[loser].score -= points;
    player.score += points;
  }

  state.message = `${player.name} wins by ${type}: ${describeWin(player)} for ${points} points.`;
  state.round += 1;
  state.dealer = (state.dealer + 1) % 4;
  render();
}

function describeWin(player) {
  if (isSevenPairs(player.hand)) return "Seven Pairs";
  const labels = [];
  if (player.riichi) labels.push("Riichi");
  if (player.melds.length === 0) labels.push("Menzen");
  if ((countTiles(player.hand)[state.dora] ?? 0) > 0) labels.push("Dora");
  return labels.length ? labels.join(", ") : "Standard hand";
}

function endDraw() {
  state.gameOver = true;
  state.message = "Exhaustive draw. Nobody completed a winning hand before the wall ran out.";
  state.round += 1;
  state.dealer = (state.dealer + 1) % 4;
  render();
}

function declareRiichi() {
  const human = state.players[0];
  if (state.turn !== 0 || !state.pendingDiscard || human.melds.length > 0 || human.score < 1000) return;
  human.riichi = true;
  human.score -= 1000;
  state.message = "You declare Riichi. Discard to lock in the chase.";
  render();
}

function showActions(actions) {
  els.actionBar.innerHTML = "";
  actions.forEach(action => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = action.cls ?? "";
    button.textContent = action.label;
    button.addEventListener("click", action.onClick);
    els.actionBar.append(button);
  });
}

function clearActions() {
  els.actionBar.innerHTML = "";
}

function render() {
  els.roundLabel.textContent = `${WINDS[state.round % 4]} ${Math.floor(state.round / 4) + 1}`;
  els.wallCount.textContent = `Wall ${state.wall.length}`;
  els.doraIndicator.textContent = `Dora ${tileText(state.dora)}`;
  els.statusText.textContent = state.message;
  els.lastDiscard.innerHTML = state.lastDiscard ? tileHtml(state.lastDiscard) : "--";

  state.players.forEach((player, seat) => {
    const seatEl = els.seats[seat];
    seatEl.classList.toggle("turn", state.turn === seat && !state.gameOver);
    seatEl.innerHTML = `
      <div class="seat-header">
        <div>
          <div class="name">${player.name} · ${player.wind}</div>
          <div class="score">${player.score.toLocaleString()} pts</div>
        </div>
        <div class="badges">${player.riichi ? `<span class="badge">Riichi</span>` : ""}${seat === state.dealer ? `<span class="badge">Dealer</span>` : ""}</div>
      </div>
      ${renderHand(player, seat)}
      <div class="section-label">Melds</div>
      <div class="melds">${player.melds.map(m => m.tiles.map(tile => tileHtml(tile, true)).join("")).join("") || "None"}</div>
      <div class="section-label">River</div>
      <div class="river">${player.discards.map(tile => tileHtml(tile, true)).join("")}</div>
    `;
  });

  if (state.turn === 0 && state.pendingDiscard && !state.gameOver) {
    const actions = [];
    const human = state.players[0];
    if (!human.riichi && human.melds.length === 0 && human.score >= 1000) {
      actions.push({ label: "Riichi", onClick: declareRiichi });
    }
    if (canWin(human.hand, human.melds.length)) {
      actions.push({ label: "Tsumo", cls: "win", onClick: () => winHand(0, 0, "Tsumo") });
    }
    showActions(actions);
  }

  if (state.gameOver) {
    showActions([{ label: "Next Hand", cls: "win", onClick: startHand }]);
  }
}

function renderHand(player, seat) {
  if (seat !== 0) {
    const backs = player.hand.map(() => `<span class="tile small back">?</span>`).join("");
    return `<div class="concealed">${backs}</div>`;
  }
  const buttons = player.hand.map((tile, index) => {
    const disabled = state.turn !== 0 || !state.pendingDiscard || state.gameOver ? "disabled" : "";
    return `<button type="button" class="tile ${tileClass(tile)}" data-tile-index="${index}" ${disabled} title="Discard ${tileText(tile)}">${tileText(tile)}</button>`;
  }).join("");
  setTimeout(bindHumanTiles, 0);
  return `<div class="hand">${buttons}</div>`;
}

function bindHumanTiles() {
  document.querySelectorAll("[data-tile-index]").forEach(button => {
    button.addEventListener("click", () => discardTile(0, Number(button.dataset.tileIndex)), { once: true });
  });
}

function tileHtml(tile, small = false) {
  return `<span class="tile ${small ? "small" : ""} ${tileClass(tile)}">${tileText(tile)}</span>`;
}

function tileText(tile) {
  if (!tile) return "--";
  if (TILE_LABELS[tile]) return TILE_LABELS[tile];
  return tile[0] + tile[1].toUpperCase();
}

function tileClass(tile) {
  if (!tile) return "";
  if (tile.endsWith("s")) return "bamboo";
  if (tile.endsWith("p")) return "pin";
  if (tile.endsWith("m")) return "man";
  if (tile === "R") return "honor red";
  return "honor";
}

function isSuit(tile) {
  return SUITS.includes(tile?.[1]);
}

startHand();
