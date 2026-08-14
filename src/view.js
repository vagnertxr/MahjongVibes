// Everything that touches the DOM.

const els = {
  roundLabel: document.querySelector("#roundLabel"),
  wallCount: document.querySelector("#wallCount"),
  centerPanel: document.querySelector(".center-panel"),
  deadWall: document.querySelector("#deadWall"),
  deadWallLabel: document.querySelector("#deadWallLabel"),
  sticks: document.querySelector("#cpSticks"),
  honbaLabel: document.querySelector("#honbaLabel"),
  statusText: document.querySelector("#statusText"),
  actionBar: document.querySelector("#actionBar"),
  soundBtn: document.querySelector("#soundBtn"),
  langBtn: document.querySelector("#langBtn"),
  rulesBtn: document.querySelector("#rulesBtn"),
  newGameBtn: document.querySelector("#newGameBtn"),
  formatLabel: document.querySelector("#formatLabel"),
  formatChoiceTitle: document.querySelector("#formatChoiceTitle"),
  formatCards: Array.from(document.querySelectorAll(".format-card")),
  welcomeOverlay: document.querySelector("#welcomeOverlay"),
  welcomeTitle: document.querySelector("#welcomeTitle"),
  welcomeSubtitle: document.querySelector("#welcomeTitle + p"),
  welcomeIntro: document.querySelector(".intro-copy"),
  closeWelcomeBtn: document.querySelector("#closeWelcomeBtn"),
  welcomeLangBtn: document.querySelector("#welcomeLangBtn"),
  startPlayingBtn: document.querySelector("#startPlayingBtn"),
  showRulesBtn: document.querySelector("#showRulesBtn"),
  rulesPanel: document.querySelector("#rulesPanel"),
  rulesPages: Array.from(document.querySelectorAll(".rules-page")),
  prevRulesBtn: document.querySelector("#prevRulesBtn"),
  nextRulesBtn: document.querySelector("#nextRulesBtn"),
  rulesPageLabel: document.querySelector("#rulesPageLabel"),
  hideWelcomeCheck: document.querySelector("#hideWelcomeCheck"),
  rememberChoice: document.querySelector(".remember-choice"),
  credits: document.querySelector(".credits"),
  stage: document.querySelector("#stage"),
  riverBlocks: Array.from({ length: 4 }, (_, i) => document.querySelector(`#river-${i}`)),
  seats: Array.from({ length: 4 }, (_, i) => document.querySelector(`#seat-${i}`))
};
// Call sites build their lists in whatever order suits them; the dock always
// shows them in the same one, weakest on the left and the winning calls out on
// the right where the hand is. Sort is stable, so several kan or chi options
// keep the order the caller chose.
const ACTION_ORDER = ["pass", "chi", "pon", "kan", "riichi", "tsumo", "ron"];

function actionRank(labelKey) {
  const index = ACTION_ORDER.indexOf(labelKey);
  return index < 0 ? ACTION_ORDER.length : index;
}

function showActions(actions) {
  els.actionBar.innerHTML = "";
  [...actions]
    .sort((a, b) => actionRank(a.labelKey) - actionRank(b.labelKey))
    .forEach(action => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = [action.cls ?? "", action.labelKey ? `act-${action.labelKey}` : ""]
        .filter(Boolean)
        .join(" ");
      button.textContent = action.labelKey ? t(action.labelKey, action.labelParams) : action.label;
      button.addEventListener("click", action.onClick);
      els.actionBar.append(button);
    });
}

function clearActions() {
  els.actionBar.innerHTML = "";
}

function t(key, params = {}) {
  const template = I18N[currentLanguage][key] ?? I18N.en[key] ?? key;
  if (typeof template !== "string") return template;
  return template.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
}

function setMessage(key, params = {}) {
  state.messageKey = key;
  state.messageParams = params;
  state.message = formatMessage(key, params);
}

function formatMessage(key, params = {}) {
  return t(key, localizeMessageParams(key, params));
}

function localizeMessageParams(key, params) {
  const localized = { ...params };
  if (Number.isInteger(params.playerSeat)) {
    localized.player = playerLabel(params.playerSeat);
  }
  if (key === "wins") {
    localized.player = playerLabel(params.winner);
    localized.winVerb = winVerb(params.winner);
    localized.hand = describeWin(state.players[params.winner]);
  }
  if (key === "matchComplete") {
    localized.player = playerLabel(params.winner);
    localized.winVerb = winVerb(params.winner);
    localized.format = t(params.formatKey);
    localized.round = roundLabel(params.roundNumber);
  }
  return localized;
}

// Where a seat is drawn on this device's screen. The seat you are playing is
// always slot 0, the bottom of the board, and everyone else falls into place
// around it in turn order.
function screenSlot(seat) {
  return (seat - localSeat + 4) % 4;
}

function playerLabel(seat) {
  return seat === localSeat ? t("you") : seatName(seat);
}

function winVerb(seat) {
  if (currentLanguage === "pt") return "vence";
  return seat === localSeat ? "win" : "wins";
}

function windLabel(wind) {
  const index = WINDS.indexOf(wind);
  return WIND_LABELS[currentLanguage][index] ?? wind;
}

// A seat wind reads faster as its marker than as a word, and it is what sits in
// front of each player at a real table. The round wind gets the accent. Drawn
// from the tile art rather than the kanji so it does not depend on the reader
// having a CJK font installed.
function windMarkHtml(wind) {
  const tile = WIND_TILES[WINDS.indexOf(wind)];
  const isRound = tile === roundWindTile();
  const label = isRound ? t("roundWindOf", { wind: windLabel(wind) }) : windLabel(wind);
  return `<span class="wind-mark${isRound ? " round-wind" : ""}" role="img" aria-label="${label}" title="${label}">${tileImage(tile)}</span>`;
}

function playSound(key) {
  if (!soundEnabled) return;
  const audio = SFX[key];
  if (!audio) return;
  try {
    audio.currentTime = 0;
  } catch {
    // some browsers throw if the media isn't ready yet; a fresh play() below still works
  }
  try {
    const result = audio.play();
    if (result && typeof result.catch === "function") result.catch(() => {});
  } catch {
    // autoplay restrictions or unsupported format - fail silently
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  setStoredPreference(SOUND_STORAGE_KEY, soundEnabled ? "1" : "0");
  updateSoundButton();
}

function updateSoundButton() {
  els.soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
  els.soundBtn.title = t(soundEnabled ? "muteSound" : "unmuteSound");
}

function toggleLanguage() {
  currentLanguage = currentLanguage === "en" ? "pt" : "en";
  setStoredPreference(LANGUAGE_STORAGE_KEY, currentLanguage);
  applyLanguage();
  if (state.messageKey) {
    state.message = formatMessage(state.messageKey, state.messageParams);
  }
  render();
}

function applyLanguage() {
  const copy = I18N[currentLanguage];
  document.documentElement.lang = copy.lang;
  updateSoundButton();
  els.langBtn.textContent = copy.langButton;
  els.langBtn.title = copy.langTitle;
  els.welcomeLangBtn.textContent = copy.langButton;
  els.welcomeLangBtn.title = copy.langTitle;
  els.rulesBtn.textContent = copy.rules;
  els.rulesBtn.title = copy.rulesTitle;
  els.newGameBtn.textContent = copy.newMatch;
  els.newGameBtn.title = copy.newMatchTitle;
  updateFormatChip();
  els.deadWallLabel.textContent = copy.deadWall;
  els.formatChoiceTitle.textContent = copy.matchLength;
  els.formatCards.forEach(card => {
    card.querySelector(".fc-name").textContent = t(card.dataset.format);
    card.querySelector(".fc-desc").textContent = t(`${card.dataset.format}Desc`);
  });
  els.closeWelcomeBtn.textContent = copy.close;
  els.closeWelcomeBtn.title = copy.closeTitle;
  els.welcomeTitle.textContent = copy.welcomeTitle;
  els.welcomeSubtitle.textContent = copy.welcomeSubtitle;
  els.welcomeIntro.textContent = copy.welcomeIntro;
  els.startPlayingBtn.textContent = copy.startPlaying;
  els.prevRulesBtn.textContent = copy.previous;
  els.nextRulesBtn.textContent = copy.next;
  els.rememberChoice.lastChild.textContent = ` ${copy.hideWelcome}`;
  els.credits.innerHTML = `${copy.creditsPrefix}<a href="https://github.com/vagnertxr" target="_blank" rel="noopener noreferrer">vagnertxr</a>`;
  renderRulePages();
  updateRulesToggleLabel();
  setRulesPage(currentRulesPage);
}

function renderRulePages() {
  I18N[currentLanguage].rulesPages.forEach((content, index) => {
    if (els.rulesPages[index]) els.rulesPages[index].innerHTML = content;
  });
}

function updateRulesToggleLabel() {
  els.showRulesBtn.textContent = els.rulesPanel.hidden ? t("beginnerRules") : t("hideRules");
}

function openWelcome(showRules = false) {
  els.welcomeOverlay.hidden = false;
  els.rulesPanel.hidden = !showRules;
  updateRulesToggleLabel();
  setRulesPage(currentRulesPage);
  (showRules ? els.rulesPanel : els.startPlayingBtn).focus();
}

function closeWelcome() {
  if (els.hideWelcomeCheck.checked) {
    setStoredPreference(WELCOME_STORAGE_KEY, "1");
  }
  els.welcomeOverlay.hidden = true;
}

function toggleRules() {
  const shouldShow = els.rulesPanel.hidden;
  els.rulesPanel.hidden = !shouldShow;
  updateRulesToggleLabel();
  if (shouldShow) {
    setRulesPage(currentRulesPage);
    els.rulesPanel.focus();
  }
}

function setRulesPage(pageIndex) {
  const pageCount = els.rulesPages.length;
  currentRulesPage = Math.min(Math.max(pageIndex, 0), pageCount - 1);
  els.rulesPages.forEach((page, index) => {
    page.classList.toggle("active", index === currentRulesPage);
  });
  els.prevRulesBtn.disabled = currentRulesPage === 0;
  els.nextRulesBtn.disabled = currentRulesPage === pageCount - 1;
  els.rulesPageLabel.textContent = `${currentRulesPage + 1} / ${pageCount}`;
}

function shouldShowWelcome() {
  return getStoredPreference(WELCOME_STORAGE_KEY) !== "1";
}

function getStoredPreference(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredPreference(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Browsers can block storage in private contexts; the game still works.
  }
}

function render() {
  els.roundLabel.textContent = roundLabel();
  els.wallCount.textContent = t("wall", { count: state.wall.length });
  els.deadWall.innerHTML = renderDeadWall();
  els.deadWall.setAttribute("aria-label", t("deadWallOf", { count: state.doraIndicators.length }));
  els.sticks.innerHTML = renderTableSticks();
  els.sticks.setAttribute("aria-label", t("tableSticks", {
    riichi: state.riichiPot / 1000,
    honba: state.honba
  }));
  els.honbaLabel.textContent = state.honba > 0 ? t("honba", { count: state.honba }) : "";
  els.statusText.textContent = state.messageKey ? formatMessage(state.messageKey, state.messageParams) : t("loading");
  const winReveal = document.querySelector("#winReveal");
  if (winReveal) winReveal.remove();
  if (state.win) {
    // Over the board, not in the action dock: the dock now floats just above the
    // hand and is too small to host a full hand reveal.
    els.centerPanel.insertAdjacentHTML("beforeend", renderWinReveal());
  }

  state.players.forEach((player, seat) => {
    // #seat-N and #river-N are screen positions, not seats: slot 0 is the bottom
    // of the board, 1 the right, 2 the top, 3 the left. Mapping seat to slot is
    // the whole of the rotation -- the CSS already binds every orientation to
    // the slot, so a client at seat 2 sees itself at the bottom for free.
    const slot = screenSlot(seat);
    const seatEl = els.seats[slot];
    seatEl.classList.toggle("turn", state.turn === seat && !state.gameOver);
    seatEl.innerHTML = `
      <div class="seat-header">
        <div>
          <div class="name">${windMarkHtml(player.wind)}${playerLabel(seat)}</div>
          <div class="score">${player.score.toLocaleString()} ${t("points")}</div>
        </div>
        <div class="badges">${player.riichi ? `<span class="badge">${t("riichi")}</span>` : ""}${seat === state.dealer ? `<span class="badge">${t("dealer")}</span>` : ""}${isFuriten(player) ? `<span class="badge">${t("furiten")}</span>` : ""}${state.gameOver && !state.win && state.drawTenpaiSeats.includes(seat) ? `<span class="badge">${t("tenpaiBadge")}</span>` : ""}</div>
      </div>
      ${renderSeatBody(player, seat)}
    `;

    const riverEl = els.riverBlocks[slot];
    if (riverEl) {
      riverEl.setAttribute("aria-label", seat === localSeat ? t("yourRiver") : t("riverOf", { player: seatName(seat) }));
      riverEl.innerHTML = renderRiver(player, seat);
    }
  });

  if (state.turn === localSeat && state.pendingDiscard && !state.gameOver) {
    const actions = [];
    const human = state.players[localSeat];
    if (!human.riichi && human.melds.length === 0 && human.score >= 1000 && state.wall.length >= 4
      && canDeclareRiichi(human.hand, human.melds.length)) {
      actions.push({ labelKey: "riichi", onClick: () => declareRiichi(localSeat) });
    }
    for (const tile of legalAnkanOptions(human)) {
      actions.push({ labelKey: "kan", labelParams: { tile: tileText(tile) }, onClick: () => declareAnkan(localSeat, tile) });
    }
    if (!human.riichi) {
      for (const tile of kakanOptions(human)) {
        actions.push({ labelKey: "kan", labelParams: { tile: tileText(tile) }, onClick: () => declareKakan(localSeat, tile) });
      }
    }
    if (canWin(human.hand, human.melds.length) && checkWin(localSeat, "Tsumo", human.drawnTile)) {
      actions.push({ labelKey: "tsumo", cls: "win", onClick: () => winHand(localSeat, localSeat, "Tsumo") });
    }
    showActions(actions);
  }

  if (state.gameOver) {
    showActions([state.matchOver
      ? { labelKey: "newMatch", cls: "win", onClick: startMatch }
      : { labelKey: "nextHand", cls: "win", onClick: startHand }
    ]);
  }
}

function normalizeFormat(format) {
  if (format === "topusen") return "tonpuusen";
  return MATCH_FORMATS[format]?.key ?? "tonpuusen";
}

function roundLabel(round = state.round) {
  const windIndex = Math.floor(round / 4) % WIND_LABELS[currentLanguage].length;
  const handNumber = (round % 4) + 1;
  return `${WIND_LABELS[currentLanguage][windIndex]} ${handNumber}`;
}

function renderSeatBody(player, seat) {
  const hand = renderHand(player, seat);
  const melds = renderMeldTiles(player);

  if (seat === localSeat) {
    return `
      <div class="human-table">
        ${hand}
        <div class="human-public">
          ${renderTileLane(t("melds"), "melds", melds)}
        </div>
      </div>
    `;
  }

  return `
    ${hand}
    ${melds ? renderTileLane(t("melds"), "melds", melds) : ""}
  `;
}

// The dead wall's 14 tiles split exactly the way a real one does: four
// replacement tiles, then five dora/ura pairs. This game's indexing lines up --
// dora n is deadWall[4 + n] and its ura is deadWall[13 - n] underneath it -- so
// seven stacks show the whole thing, with a stack flipping face up per kan.
function renderDeadWall() {
  const stacks = [];
  for (let i = 0; i < DEAD_WALL_STACKS; i += 1) {
    const doraIndex = i - REPLACEMENT_STACKS;
    const revealed = doraIndex >= 0 && doraIndex < state.doraIndicators.length;
    const tile = revealed ? state.doraIndicators[doraIndex] : null;
    if (!revealed) {
      stacks.push(
        `<span class="dw-stack">`
        + `<span class="tile small back" role="img" aria-label="${t("deadWallTile")}">${tileImage(null)}</span>`
        + `</span>`
      );
      continue;
    }
    const dora = doraFromIndicator(tile);
    const label = t("indicatorMeans", { indicator: tileName(tile), dora: tileName(dora) });
    stacks.push(
      `<span class="dw-stack revealed" tabindex="0" role="img" aria-label="${label}">`
      + `<span class="tile small ${tileClass(tile)}">${tileImage(tile)}</span>`
      + `<span class="dw-popup" aria-hidden="true">`
      + `<span class="dwp-row">`
      + `<span class="dwp-cell"><span class="dwp-cap">${t("indicator")}</span><span class="tile small ${tileClass(tile)}">${tileImage(tile)}</span></span>`
      + `<span class="dwp-arrow">→</span>`
      + `<span class="dwp-cell"><span class="dwp-cap">${t("doraWord")}</span><span class="tile small ${tileClass(dora)}">${tileImage(dora)}</span></span>`
      + `</span>`
      + `<span class="dwp-text">${tileName(dora)}</span>`
      + `</span>`
      + `</span>`
    );
  }
  return stacks.join("");
}

// What is physically lying on the table: one 1000-point stick per riichi in the
// pot, and one short 100-point marker per honba. Purely a view of state.
function renderTableSticks() {
  const riichi = Math.floor(state.riichiPot / 1000);
  const sticks = Array.from({ length: riichi }, () => `<span class="riichi-stick" aria-hidden="true"></span>`);
  // Honba markers stack in rows so a long dealer streak stays inside the core.
  const honba = Array.from({ length: state.honba }, () => `<span class="honba-stick" aria-hidden="true"></span>`);
  if (honba.length) sticks.push(`<span class="honba-row">${honba.join("")}</span>`);
  return sticks.join("");
}

function renderRiver(player, seat) {
  const visible = player.discards.filter(entry => entry.calledBy === null);
  const lastIndex = visible.length - 1;
  const isLastDiscardSeat = seat === state.lastDiscardFrom && !state.win;
  const rows = [];
  for (let start = 0; start < visible.length; start += RIVER_ROW_SIZE) {
    const cells = visible
      .slice(start, start + RIVER_ROW_SIZE)
      .map((entry, offset) => riverSlotHtml(entry, isLastDiscardSeat && start + offset === lastIndex))
      .join("");
    rows.push(`<div class="river-row">${cells}</div>`);
  }
  return `<div class="river-rows">${rows.join("")}</div>`;
}

function riverSlotHtml(entry, recent) {
  const classes = ["river-slot"];
  if (entry.riichi) classes.push("sideways");
  if (entry.tsumogiri) classes.push("tsumogiri");
  if (recent) classes.push("recent-slot");
  // entry.seq is deliberately not drawn: the wall counter already tells you how
  // far into the hand you are, and a number on every tile buried the tiles.
  // It stays in the accessible label, where it costs no visual noise.
  const label = riverTileLabel(entry);
  return `<span class="${classes.join(" ")}">`
    + `<span class="tile small ${tileClass(entry.tile)}" role="img" aria-label="${label}" title="${label}">${tileImage(entry.tile)}</span>`
    + `</span>`;
}

function riverTileLabel(entry) {
  const parts = [tileName(entry.tile), t("discardNumber", { n: entry.seq })];
  if (entry.tsumogiri) parts.push(t("tsumogiri"));
  if (entry.riichi) parts.push(t("riichiTile"));
  return parts.join(" · ");
}

function renderMelds(player) {
  if (player.melds.length === 0) return "";
  const meldTiles = renderMeldTiles(player);
  return `
    <div class="section-label">${t("melds")}</div>
    <div class="melds">${meldTiles}</div>
  `;
}

function renderMeldTiles(player) {
  return player.melds.map(meld => renderMeldTileGroup(meld)).join("");
}

function renderMeldTileGroup(meld) {
  if (meld.type === "ankan" && !state.gameOver) {
    return meld.tiles.map((tile, index) => {
      return index === 1 || index === 2 ? tileBackHtml(true) : tileHtml(tile, true);
    }).join("");
  }
  return meld.tiles.map(tile => tileHtml(tile, true)).join("");
}

function renderTileLane(label, className, content) {
  return `
    <div class="tile-lane">
      <div class="section-label">${label}</div>
      <div class="${className}">${content}</div>
    </div>
  `;
}

// Final standings: everyone's score, sorted, with the gap from the 25,000 start.
// Ties break by seat, the same way leadingPlayerSeat picks the leader.
function renderMatchSummary() {
  const ranked = state.players
    .map((player, seat) => ({ seat, player }))
    .sort((a, b) => b.player.score - a.player.score || a.seat - b.seat);
  const rows = ranked.map((entry, index) => {
    const delta = entry.player.score - STARTING_SCORE;
    const deltaClass = delta > 0 ? "up" : delta < 0 ? "down" : "even";
    const sign = delta > 0 ? "+" : "";
    return `
      <li class="ms-row${index === 0 ? " winner" : ""}">
        <span class="ms-place">${index + 1}</span>
        ${windMarkHtml(entry.player.wind)}
        <span class="ms-name">${playerLabel(entry.seat)}</span>
        <span class="ms-score">${entry.player.score.toLocaleString()}</span>
        <span class="ms-delta ${deltaClass}">${sign}${delta.toLocaleString()}</span>
      </li>
    `;
  }).join("");
  return `
    <div id="matchSummary" class="match-summary" role="dialog" aria-modal="true" aria-labelledby="msTitle">
      <div class="ms-card">
        <h2 id="msTitle" class="ms-title">${t("matchResults")}</h2>
        <p class="ms-sub">${t(state.format)} · ${roundLabel(Math.max(state.round - 1, 0))}</p>
        <ol class="ms-list">${rows}</ol>
        <button type="button" id="msNewMatch" class="win">${t("newMatch")}</button>
      </div>
    </div>
  `;
}

function renderWinReveal() {
  const winner = playerLabel(state.win.winner);
  const handTiles = state.win.hand.map((tile, index) => {
    const isWinTile = state.win.tile && index === state.win.hand.lastIndexOf(state.win.tile);
    return tileHtml(tile, true, isWinTile);
  }).join("");
  const meldTiles = state.win.melds.flat().map(tile => tileHtml(tile, true)).join("");
  const evaluation = state.win.evaluation;
  // Each yaku on its own row with its han out to the right, so a five-yaku hand
  // reads as a list of what earned the points rather than a run-on line.
  const yakuLines = evaluation
    ? evaluation.yakuList.map(y => `<li><span class="yk-name">${yakuDisplayName(y)}</span>`
      + `<span class="yk-han">${y.yakuman ? t("yakuman") : t("hanValue", { han: y.han })}</span></li>`).join("")
    : "";
  const scoreLine = evaluation
    ? `<div class="win-score">`
      + `<span class="ws-detail">${evaluation.isYakuman ? t("yakuman") : t("hanFu", { han: evaluation.han, fu: evaluation.fu })}</span>`
      + `<span class="ws-points">${evaluation.points.toLocaleString()} ${t("points")}</span>`
      + `</div>`
    : "";
  return `
    <div id="winReveal" class="win-reveal" role="dialog" aria-live="polite">
      <div class="section-label">${t("winningHand")} · ${winner}</div>
      <div class="win-hand">${handTiles}${meldTiles ? `<span class="win-divider"></span>${meldTiles}` : ""}</div>
      ${yakuLines ? `<ul class="win-yaku-list">${yakuLines}</ul>` : ""}
      ${scoreLine}
    </div>
  `;
}

function renderHand(player, seat) {
  if (seat !== localSeat) {
    // Side seats stack their backs into a narrow standing column, the way a real
    // table looks from across it. That frees the board corners for the plates.
    const orientation = seat === 1 || seat === 3 ? " standing" : "";
    const backs = player.hand.map(() => tileBackHtml(true)).join("");
    return `<div class="concealed${orientation}">${backs}</div>`;
  }
  const drawnIndex = state.turn === localSeat && state.pendingDiscard && !state.gameOver && player.drawnTile
    ? player.hand.lastIndexOf(player.drawnTile)
    : -1;
  const handLocked = player.riichi && !player.riichiDeclaring;
  const handButtons = player.hand
    .map((tile, index) => ({ tile, index }))
    .filter(entry => entry.index !== drawnIndex)
    .map(entry => tileButton(entry.tile, entry.index, "", handLocked))
    .join("");
  const drawSlot = drawnIndex >= 0
    ? tileButton(player.hand[drawnIndex], drawnIndex, "drawn")
    : `<span class="draw-placeholder" aria-hidden="true"></span>`;
  setTimeout(bindHumanTiles, 0);
  return `
    <div class="hand-row">
      <div class="hand">${handButtons}</div>
      <div class="draw-slot">${drawSlot}</div>
    </div>
  `;
}

function tileButton(tile, index, extraClass = "", forceDisabled = false) {
    const disabled = forceDisabled || state.turn !== localSeat || !state.pendingDiscard || state.gameOver ? "disabled" : "";
    const title = t("discardTitle", { tile: tileName(tile) });
    return `<button type="button" class="tile ${extraClass} ${tileClass(tile)}" data-tile-index="${index}" ${disabled} title="${title}" aria-label="${title}">${tileImage(tile)}</button>`;
}

function bindHumanTiles() {
  document.querySelectorAll("[data-tile-index]").forEach(button => {
    button.addEventListener("click", () => discardTile(localSeat, Number(button.dataset.tileIndex)), { once: true });
  });
}


// The board is authored at STAGE_W x STAGE_H and scaled by a single transform,
// so nothing inside ever reflows and browser zoom cannot break the layout. On an
// upright phone the same transform turns the table sideways instead of squeezing
// it into a narrow column.
function fitStage() {
  if (!els.stage) return;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const rotate = vh > vw;
  const availW = rotate ? vh : vw;
  const availH = rotate ? vw : vh;
  const scale = Math.min(availW / STAGE_W, availH / STAGE_H);
  const w = STAGE_W * scale;
  const h = STAGE_H * scale;
  // With transform-origin 0 0, rotate(90deg) maps the box to x in [-h, 0] and
  // y in [0, w], so the offsets below re-centre it in the viewport.
  els.stage.style.transform = rotate
    ? `translate(${(vw + h) / 2}px, ${(vh - w) / 2}px) rotate(90deg) scale(${scale})`
    : `translate(${(vw - w) / 2}px, ${(vh - h) / 2}px) scale(${scale})`;
}
