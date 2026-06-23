const SUITS = ["m", "p", "s"];
const WINDS = ["East", "South", "West", "North"];
const HONORS = ["E", "S", "W", "N", "Wh", "G", "R"];
const NAMES = ["You", "Cartola", "Alcione", "Adoniran"];
const TILE_ORDER = [
  "1m","2m","3m","4m","5m","6m","7m","8m","9m",
  "1p","2p","3p","4p","5p","6p","7p","8p","9p",
  "1s","2s","3s","4s","5s","6s","7s","8s","9s",
  "E","S","W","N","Wh","G","R"
];
const TILE_LABELS = {
  E: "東", S: "南", W: "西", N: "北", Wh: "白", G: "發", R: "中"
};
const SUIT_NAMES = {
  m: "Characters / Manzu",
  p: "Circles / Pinzu",
  s: "Bamboo / Souzu"
};
const HONOR_NAMES = {
  E: "East Wind",
  S: "South Wind",
  W: "West Wind",
  N: "North Wind",
  Wh: "White Dragon",
  G: "Green Dragon",
  R: "Red Dragon"
};
const WIND_LABELS = {
  en: ["East", "South", "West", "North"],
  pt: ["Leste", "Sul", "Oeste", "Norte"]
};
const HONOR_NAMES_PT = {
  E: "Vento Leste",
  S: "Vento Sul",
  W: "Vento Oeste",
  N: "Vento Norte",
  Wh: "Dragão Branco",
  G: "Dragão Verde",
  R: "Dragão Vermelho"
};
const WELCOME_STORAGE_KEY = "mahjong-vibes-hide-welcome";
const LANGUAGE_STORAGE_KEY = "mahjong-vibes-language";
const FORMAT_STORAGE_KEY = "mahjong-vibes-format";
const MATCH_FORMATS = {
  tonpuusen: { key: "tonpuusen", rounds: 4 },
  hanchan: { key: "hanchan", rounds: 8 }
};
const I18N = {
  en: {
    lang: "en",
    langButton: "🇧🇷",
    langTitle: "Mudar para Português",
    you: "You",
    points: "pts",
    wall: "Wall {count}",
    dora: "Dora {tile}",
    rules: "Rules",
    rulesTitle: "Open beginner rules",
    newHand: "Next Hand",
    newHandTitle: "Start the next hand",
    newMatch: "New Match",
    newMatchTitle: "Start a new match",
    format: "Format",
    formatTitle: "Match format",
    tonpuusen: "Tonpuusen",
    hanchan: "Hanchan",
    close: "Close",
    closeTitle: "Close welcome",
    welcomeTitle: "Welcome to Mahjong Vibes",
    welcomeSubtitle: "Riichi Mahjong, local table, quick hands.",
    welcomeIntro: "Make four groups and one pair. Draw a tile, discard a tile, and watch for chances to call, declare riichi, or win.",
    beginnerRules: "Beginner Rules",
    hideRules: "Hide Rules",
    startPlaying: "Start Playing",
    previous: "Previous",
    next: "Next",
    hideWelcome: "Do not show this welcome next time",
    creditsPrefix: "Created by ",
    lastDiscard: "Last discard",
    winningHand: "Winning hand",
    loading: "Loading table...",
    dealer: "Dealer",
    river: "River",
    melds: "Melds",
    riichi: "Riichi",
    tsumo: "Tsumo",
    ron: "Ron",
    pass: "Pass",
    pon: "Pon",
    chi: "Chi {tiles}",
    nextHand: "Next Hand",
    discardTitle: "Discard {tile}",
    noTile: "No tile",
    standardHand: "Standard hand",
    sevenPairs: "Seven Pairs",
    menzen: "Menzen",
    dealerStarts: "{player} deals. Draw and discard to chase Mahjong Vibes.",
    playerDraws: "{player} draws.",
    playerDiscards: "{player} discards {tile}.",
    callPon: "You call Pon on {tile}. Discard a tile.",
    callChi: "You call Chi. Discard a tile.",
    wins: "{player} {winVerb} by {type}: {hand} for {points} points.",
    exhaustiveDraw: "Exhaustive draw. Nobody completed a winning hand before the wall ran out.",
    matchComplete: "{player} {winVerb} the {format} after {round}.",
    declareRiichi: "You declare Riichi. Discard to lock in the chase.",
    suits: {
      m: "Characters / Manzu",
      p: "Circles / Pinzu",
      s: "Bamboo / Souzu"
    },
    rulesPages: [
      `<h3>1. What Makes Riichi Different</h3><p>Riichi Mahjong is the Japanese four-player version of Mahjong. Like most Mahjong games, you build a complete hand by drawing and discarding tiles. The big Riichi twist is that a complete shape is not enough: most winning hands also need at least one scoring pattern, called a yaku.</p><p>Compared with many Chinese Mahjong rulesets, Riichi puts more weight on closed-hand play, defensive discarding, declared riichi, dora bonus tiles, and exact win conditions. You often choose between opening your hand for speed or keeping it closed for stronger scoring options.</p><p>Mahjong Vibes keeps the table lightweight, but the core rhythm is the same: draw, discard, read the rivers, call when useful, and win by Tsumo or Ron.</p>`,
      `<h3>2. The Tiles</h3><p>There are 34 unique tile types, with four copies of each, for 136 tiles in the wall.</p><div class="rules-example"><strong>Manzu / Characters</strong><div class="guide-tiles">${guideTiles(["1m","2m","3m","4m","5m","6m","7m","8m","9m"])}</div></div><div class="rules-example"><strong>Pinzu / Circles</strong><div class="guide-tiles">${guideTiles(["1p","2p","3p","4p","5p","6p","7p","8p","9p"])}</div></div><div class="rules-example"><strong>Souzu / Bamboo</strong><div class="guide-tiles">${guideTiles(["1s","2s","3s","4s","5s","6s","7s","8s","9s"])}</div></div><div class="rules-example"><strong>Honors: winds and dragons</strong><div class="guide-tiles">${guideTiles(["E","S","W","N","Wh","G","R"])}</div></div>`,
      `<h3>3. How a Hand Is Built</h3><p>The normal winning shape is four groups plus one pair. Groups are sequences, triplets, or sometimes quads. Honors cannot make sequences.</p><div class="rules-example"><strong>Sequence / Shuntsu</strong><div class="guide-tiles">${guideTiles(["2s","3s","4s"])}</div></div><div class="rules-example"><strong>Triplet / Koutsu</strong><div class="guide-tiles">${guideTiles(["E","E","E"])}</div></div><div class="rules-example"><strong>Pair / Toitsu</strong><div class="guide-tiles">${guideTiles(["5p","5p"])}</div></div><div class="rules-example"><strong>Complete example: four groups and one pair</strong><div class="guide-tiles long">${guideTiles(["2m","3m","4m","3p","4p","5p","6s","7s","8s","R","R","R","Wh","Wh"])}</div></div>`,
      `<h3>4. Turn Flow, Calls, and Winning</h3><p>On your turn, you draw one tile and discard one tile. Discards go into each player's river, which is public information. Reading those rivers helps you attack and defend.</p><p><strong>Chi</strong> uses the player-left discard to complete a sequence. <strong>Pon</strong> uses any player's discard to complete a triplet. Calling opens your hand, which is faster but removes some closed-only yaku.</p><p><strong>Tsumo</strong> means you draw your own winning tile. <strong>Ron</strong> means another player discards your winning tile. If a tile seems dangerous because an opponent may be waiting on it, discarding it can deal into Ron.</p><div class="rules-example"><strong>Waiting example: this hand wants 3M or 6M to finish the sequence</strong><div class="guide-tiles">${guideTiles(["4m","5m"])}<span class="tile small muted-tile">?</span></div></div>`,
      `<h3>5. Common Beginner Yaku</h3><p>A yaku is a scoring condition that lets the hand win. Dora are bonuses, not yaku. A hand full of dora still needs a yaku.</p><div class="rules-example"><strong>Riichi:</strong> closed hand, one tile from winning, declare riichi and pay 1,000 points.</div><div class="rules-example"><strong>Tanyao / All Simples:</strong> no terminals, no winds, no dragons.<div class="guide-tiles">${guideTiles(["2m","3m","4m","4p","5p","6p","6s","7s","8s"])}</div></div><div class="rules-example"><strong>Yakuhai / Value honors:</strong> triplet of dragons, seat wind, or round wind.<div class="guide-tiles">${guideTiles(["R","R","R"])}</div></div><div class="rules-example"><strong>Pinfu:</strong> closed hand with only sequences, a non-value pair, and a two-sided wait.</div><div class="rules-example"><strong>Seven Pairs / Chiitoitsu:</strong> seven different pairs instead of four groups and one pair.<div class="guide-tiles long">${guideTiles(["2m","2m","4p","4p","6s","6s","Wh","Wh"])}</div></div>`,
      `<h3>6. Dora, Defense, and First Tips</h3><p>Dora increase points after you win. In this game the dora display shows the bonus tile directly. In full Riichi rules, the indicator points to the next tile in order.</p><p>Defense matters because Ron punishes the discarder. When another player looks threatening, safer discards are usually tiles they have already discarded or honors that are visibly exhausted.</p><p>Good beginner habits: keep useful sequences, avoid breaking pairs too early, do not call every tile, and remember that a closed hand can declare riichi. If your hand has no obvious yaku, staying closed and aiming for riichi is often the simplest plan.</p>`,
      `<h3>7. Match Formats</h3><p><strong>Tonpuusen</strong> is an East-only match: East 1 through East 4. <strong>Hanchan</strong> plays East and South: East 1 through South 4.</p><p>The dealer repeats the same hand after a dealer win. Other wins and exhaustive draws advance the dealer and hand number.</p><p>At the scheduled end, the match finishes when the leader has at least 30,000 points. If nobody has reached that mark, play continues into the next wind until someone leads with 30,000 or more. The match also ends immediately if any player drops below 0 points.</p>`
    ]
  },
  pt: {
    lang: "pt-BR",
    langButton: "🇬🇧",
    langTitle: "Switch to English",
    you: "Você",
    points: "pts",
    wall: "Muro {count}",
    dora: "Dora {tile}",
    rules: "Regras",
    rulesTitle: "Abrir regras para iniciantes",
    newHand: "Próxima Mão",
    newHandTitle: "Começar a próxima mão",
    newMatch: "Nova Partida",
    newMatchTitle: "Começar uma nova partida",
    format: "Formato",
    formatTitle: "Formato da partida",
    tonpuusen: "Tonpuusen",
    hanchan: "Hanchan",
    close: "Fechar",
    closeTitle: "Fechar boas-vindas",
    welcomeTitle: "Bem-vindo ao Mahjong Vibes",
    welcomeSubtitle: "Riichi Mahjong, mesa local, partidas rápidas.",
    welcomeIntro: "Faça quatro grupos e um par. Compre uma peça, descarte uma peça e procure chances de chamar, declarar riichi ou vencer.",
    beginnerRules: "Regras Iniciais",
    hideRules: "Ocultar Regras",
    startPlaying: "Jogar",
    previous: "Anterior",
    next: "Próxima",
    hideWelcome: "Não mostrar estas boas-vindas novamente",
    creditsPrefix: "Criado por ",
    lastDiscard: "Último descarte",
    winningHand: "Mão vencedora",
    loading: "Carregando mesa...",
    dealer: "Oya",
    river: "Rio",
    melds: "Chamadas",
    riichi: "Riichi",
    tsumo: "Tsumo",
    ron: "Ron",
    pass: "Passar",
    pon: "Pon",
    chi: "Chi {tiles}",
    nextHand: "Próxima Mão",
    discardTitle: "Descartar {tile}",
    noTile: "Nenhuma peça",
    standardHand: "Mão comum",
    sevenPairs: "Sete Pares",
    menzen: "Fechada",
    dealerStarts: "{player} distribui. Compre e descarte para entrar no Mahjong Vibes.",
    playerDraws: "{player} compra.",
    playerDiscards: "{player} descarta {tile}.",
    callPon: "Você chama Pon em {tile}. Descarte uma peça.",
    callChi: "Você chama Chi. Descarte uma peça.",
    wins: "{player} {winVerb} por {type}: {hand}, {points} pontos.",
    exhaustiveDraw: "Empate exaustivo. Ninguém completou uma mão antes do muro acabar.",
    matchComplete: "{player} {winVerb} o {format} após {round}.",
    declareRiichi: "Você declara Riichi. Descarte para travar a espera.",
    suits: {
      m: "Caracteres / Manzu",
      p: "Círculos / Pinzu",
      s: "Bambus / Souzu"
    },
    rulesPages: [
      `<h3>1. O Que Diferencia o Riichi</h3><p>Riichi Mahjong é a versão japonesa para quatro jogadores. Como em outras variantes, você monta uma mão completa comprando e descartando peças. A diferença principal é que a forma completa normalmente também precisa de pelo menos um padrão de pontuação, chamado yaku.</p><p>Comparado a muitas regras chinesas, o Riichi valoriza mais a mão fechada, defesa pelos descartes, declaração de riichi, bônus de dora e condições exatas de vitória. Você escolhe entre abrir a mão para correr ou manter fechada para pontuar melhor.</p><p>Mahjong Vibes é leve, mas o ritmo central é o mesmo: comprar, descartar, ler os rios, chamar quando vale a pena e vencer por Tsumo ou Ron.</p>`,
      `<h3>2. As Peças</h3><p>Existem 34 tipos de peça, com quatro cópias de cada uma, formando um muro de 136 peças.</p><div class="rules-example"><strong>Manzu / Caracteres</strong><div class="guide-tiles">${guideTiles(["1m","2m","3m","4m","5m","6m","7m","8m","9m"])}</div></div><div class="rules-example"><strong>Pinzu / Círculos</strong><div class="guide-tiles">${guideTiles(["1p","2p","3p","4p","5p","6p","7p","8p","9p"])}</div></div><div class="rules-example"><strong>Souzu / Bambus</strong><div class="guide-tiles">${guideTiles(["1s","2s","3s","4s","5s","6s","7s","8s","9s"])}</div></div><div class="rules-example"><strong>Honras: ventos e dragões</strong><div class="guide-tiles">${guideTiles(["E","S","W","N","Wh","G","R"])}</div></div>`,
      `<h3>3. Como Montar uma Mão</h3><p>A forma normal de vitória é quatro grupos e um par. Grupos podem ser sequências, trincas ou, em regras completas, quadras. Honras não formam sequências.</p><div class="rules-example"><strong>Sequência / Shuntsu</strong><div class="guide-tiles">${guideTiles(["2s","3s","4s"])}</div></div><div class="rules-example"><strong>Trinca / Koutsu</strong><div class="guide-tiles">${guideTiles(["E","E","E"])}</div></div><div class="rules-example"><strong>Par / Toitsu</strong><div class="guide-tiles">${guideTiles(["5p","5p"])}</div></div><div class="rules-example"><strong>Exemplo completo: quatro grupos e um par</strong><div class="guide-tiles long">${guideTiles(["2m","3m","4m","3p","4p","5p","6s","7s","8s","R","R","R","Wh","Wh"])}</div></div>`,
      `<h3>4. Turno, Chamadas e Vitória</h3><p>No seu turno, você compra uma peça e descarta uma peça. Os descartes ficam no rio de cada jogador, uma informação pública. Ler esses rios ajuda a atacar e defender.</p><p><strong>Chi</strong> usa o descarte do jogador à sua esquerda para completar uma sequência. <strong>Pon</strong> usa o descarte de qualquer jogador para completar uma trinca. Chamar abre a mão: é mais rápido, mas remove alguns yaku de mão fechada.</p><p><strong>Tsumo</strong> é vencer comprando sua própria peça. <strong>Ron</strong> é vencer com o descarte de outra pessoa. Se uma peça parece perigosa porque alguém pode estar esperando nela, descartá-la pode dar Ron ao adversário.</p><div class="rules-example"><strong>Exemplo de espera: esta forma quer 3M ou 6M para completar a sequência</strong><div class="guide-tiles">${guideTiles(["4m","5m"])}<span class="tile small muted-tile">?</span></div></div>`,
      `<h3>5. Yaku Fáceis para Começar</h3><p>Yaku é uma condição de pontuação que permite vencer. Dora é bônus, não yaku. Uma mão cheia de dora ainda precisa de um yaku.</p><div class="rules-example"><strong>Riichi:</strong> mão fechada, a uma peça da vitória; declare riichi e pague 1.000 pontos.</div><div class="rules-example"><strong>Tanyao / Todas Simples:</strong> sem terminais, sem ventos e sem dragões.<div class="guide-tiles">${guideTiles(["2m","3m","4m","4p","5p","6p","6s","7s","8s"])}</div></div><div class="rules-example"><strong>Yakuhai / Honras de valor:</strong> trinca de dragão, vento do assento ou vento da rodada.<div class="guide-tiles">${guideTiles(["R","R","R"])}</div></div><div class="rules-example"><strong>Pinfu:</strong> mão fechada só com sequências, par sem valor e espera dos dois lados.</div><div class="rules-example"><strong>Sete Pares / Chiitoitsu:</strong> sete pares diferentes em vez de quatro grupos e um par.<div class="guide-tiles long">${guideTiles(["2m","2m","4p","4p","6s","6s","Wh","Wh"])}</div></div>`,
      `<h3>6. Dora, Defesa e Primeiras Dicas</h3><p>Dora aumenta os pontos depois que você vence. Neste jogo, o mostrador exibe diretamente a peça de bônus. Nas regras completas, o indicador aponta para a próxima peça na ordem.</p><p>Defesa importa porque Ron pune quem descartou. Quando alguém parece perigoso, descartes mais seguros costumam ser peças que essa pessoa já descartou ou honras que você já viu esgotadas.</p><p>Bons hábitos iniciais: mantenha sequências úteis, não quebre pares cedo demais, não chame todas as peças e lembre que uma mão fechada pode declarar riichi. Se sua mão não tem yaku claro, ficar fechado e mirar riichi costuma ser o plano mais simples.</p>`
      ,
      `<h3>7. Formatos de Partida</h3><p><strong>Tonpuusen</strong> Ã© uma partida sÃ³ de Leste: Leste 1 atÃ© Leste 4. <strong>Hanchan</strong> joga Leste e Sul: Leste 1 atÃ© Sul 4.</p><p>O dealer repete a mesma mÃ£o depois de uma vitÃ³ria do dealer. Outras vitÃ³rias e empates exaustivos avanÃ§am o dealer e o nÃºmero da mÃ£o.</p><p>No fim programado, a partida termina quando o lÃ­der tem pelo menos 30.000 pontos. Se ninguÃ©m chegou a essa marca, o jogo continua para o prÃ³ximo vento atÃ© alguÃ©m liderar com 30.000 ou mais. A partida tambÃ©m termina imediatamente se qualquer jogador ficar abaixo de 0 ponto.</p>`
    ]
  }
};
const state = {
  round: 0,
  format: "tonpuusen",
  dealer: 0,
  turn: 0,
  wall: [],
  deadWall: [],
  dora: "",
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

const els = {
  roundLabel: document.querySelector("#roundLabel"),
  wallCount: document.querySelector("#wallCount"),
  doraIndicator: document.querySelector("#doraIndicator"),
  lastDiscard: document.querySelector("#lastDiscard"),
  statusText: document.querySelector("#statusText"),
  actionBar: document.querySelector("#actionBar"),
  langBtn: document.querySelector("#langBtn"),
  rulesBtn: document.querySelector("#rulesBtn"),
  newGameBtn: document.querySelector("#newGameBtn"),
  formatLabel: document.querySelector("#formatLabel"),
  formatSelect: document.querySelector("#formatSelect"),
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
  riverTitle: document.querySelector(".river-title"),
  seats: Array.from({ length: 4 }, (_, i) => document.querySelector(`#seat-${i}`))
};
let currentRulesPage = 0;
let currentLanguage = getStoredPreference(LANGUAGE_STORAGE_KEY) === "pt" ? "pt" : "en";

els.newGameBtn.addEventListener("click", startMatch);
els.formatSelect.addEventListener("change", () => {
  state.format = normalizeFormat(els.formatSelect.value);
  setStoredPreference(FORMAT_STORAGE_KEY, state.format);
  startMatch();
});
els.langBtn.addEventListener("click", toggleLanguage);
els.welcomeLangBtn.addEventListener("click", toggleLanguage);
els.rulesBtn.addEventListener("click", () => openWelcome(true));
els.closeWelcomeBtn.addEventListener("click", closeWelcome);
els.startPlayingBtn.addEventListener("click", closeWelcome);
els.showRulesBtn.addEventListener("click", toggleRules);
els.prevRulesBtn.addEventListener("click", () => setRulesPage(currentRulesPage - 1));
els.nextRulesBtn.addEventListener("click", () => setRulesPage(currentRulesPage + 1));
els.welcomeOverlay.addEventListener("click", event => {
  if (event.target === els.welcomeOverlay) closeWelcome();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !els.welcomeOverlay.hidden) closeWelcome();
});

function startMatch() {
  state.format = normalizeFormat(els.formatSelect.value);
  state.round = 0;
  state.dealer = 0;
  state.matchOver = false;
  state.players = [];
  startHand();
}

function startHand() {
  if (state.matchOver) {
    startMatch();
    return;
  }
  state.wall = shuffle(buildWall());
  state.deadWall = state.wall.splice(-14);
  state.dora = state.deadWall[4];
  state.turn = state.dealer;
  state.lastDiscard = null;
  state.lastDiscardFrom = null;
  state.pendingDiscard = false;
  state.gameOver = false;
  state.win = null;
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
  setMessage("dealerStarts", { playerSeat: state.dealer });
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
  setMessage("playerDraws", { playerSeat: state.turn });
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
  state.turn = 0;
  state.pendingDiscard = true;
  setMessage("callPon", { tile: tileText(tile) });
  clearActions();
  render();
}

function callChi(tile, option, fromSeat) {
  const human = state.players[0];
  removeTiles(human.hand, option);
  human.melds.push({ type: "chi", tiles: [...option, tile].sort(compareTiles), from: fromSeat });
  state.turn = 0;
  state.pendingDiscard = true;
  setMessage("callChi");
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
  const winTile = type === "Ron" && state.lastDiscardFrom === loser ? state.lastDiscard : null;
  const revealedHand = [...player.hand];
  if (winTile) revealedHand.push(winTile);
  revealedHand.sort(compareTiles);
  state.win = {
    winner,
    type,
    tile: winTile,
    hand: revealedHand,
    melds: player.melds.map(meld => [...meld.tiles])
  };
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

  setMessage("wins", { winner, type, points });
  finishHand(winner === state.dealer);
  render();
}

function describeWin(player) {
  if (isSevenPairs(player.hand)) return t("sevenPairs");
  const labels = [];
  if (player.riichi) labels.push(t("riichi"));
  if (player.melds.length === 0) labels.push(t("menzen"));
  if ((countTiles(player.hand)[state.dora] ?? 0) > 0) labels.push("Dora");
  return labels.length ? labels.join(", ") : t("standardHand");
}

function endDraw() {
  state.gameOver = true;
  setMessage("exhaustiveDraw");
  finishHand(false);
  render();
}

function finishHand(dealerRepeats) {
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
  human.riichi = true;
  human.score -= 1000;
  setMessage("declareRiichi");
  render();
}

function showActions(actions) {
  els.actionBar.innerHTML = "";
  actions.forEach(action => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = action.cls ?? "";
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

function playerLabel(seat) {
  return seat === 0 ? t("you") : NAMES[seat];
}

function winVerb(seat) {
  if (currentLanguage === "pt") return "vence";
  return seat === 0 ? "win" : "wins";
}

function windLabel(wind) {
  const index = WINDS.indexOf(wind);
  return WIND_LABELS[currentLanguage][index] ?? wind;
}

function guideTiles(tiles) {
  return tiles.map(tile => `<span class="tile small ${tileClass(tile)}">${tileFaceText(tile)}</span>`).join("");
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
  els.langBtn.textContent = copy.langButton;
  els.langBtn.title = copy.langTitle;
  els.welcomeLangBtn.textContent = copy.langButton;
  els.welcomeLangBtn.title = copy.langTitle;
  els.rulesBtn.textContent = copy.rules;
  els.rulesBtn.title = copy.rulesTitle;
  els.newGameBtn.textContent = copy.newMatch;
  els.newGameBtn.title = copy.newMatchTitle;
  els.formatLabel.textContent = copy.format;
  els.formatSelect.title = copy.formatTitle;
  Array.from(els.formatSelect.options).forEach(option => {
    option.textContent = t(option.value);
  });
  els.closeWelcomeBtn.textContent = copy.close;
  els.closeWelcomeBtn.title = copy.closeTitle;
  els.welcomeTitle.textContent = copy.welcomeTitle;
  els.welcomeSubtitle.textContent = copy.welcomeSubtitle;
  els.welcomeIntro.textContent = copy.welcomeIntro;
  els.startPlayingBtn.textContent = copy.startPlaying;
  els.prevRulesBtn.textContent = copy.previous;
  els.nextRulesBtn.textContent = copy.next;
  els.riverTitle.textContent = copy.lastDiscard;
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
  els.doraIndicator.textContent = t("dora", { tile: tileText(state.dora) });
  els.statusText.textContent = state.messageKey ? formatMessage(state.messageKey, state.messageParams) : t("loading");
  els.lastDiscard.innerHTML = state.lastDiscard ? tileHtml(state.lastDiscard) : "--";
  const winReveal = document.querySelector("#winReveal");
  if (winReveal) winReveal.remove();
  if (state.win) {
    els.actionBar.insertAdjacentHTML("beforebegin", renderWinReveal());
  }

  state.players.forEach((player, seat) => {
    const seatEl = els.seats[seat];
    seatEl.classList.toggle("turn", state.turn === seat && !state.gameOver);
    seatEl.innerHTML = `
      <div class="seat-header">
        <div>
          <div class="name">${playerLabel(seat)} · ${windLabel(player.wind)}</div>
          <div class="score">${player.score.toLocaleString()} ${t("points")}</div>
        </div>
        <div class="badges">${player.riichi ? `<span class="badge">${t("riichi")}</span>` : ""}${seat === state.dealer ? `<span class="badge">${t("dealer")}</span>` : ""}</div>
      </div>
      ${renderSeatBody(player, seat)}
    `;
  });

  if (state.turn === 0 && state.pendingDiscard && !state.gameOver) {
    const actions = [];
    const human = state.players[0];
    if (!human.riichi && human.melds.length === 0 && human.score >= 1000) {
      actions.push({ labelKey: "riichi", onClick: declareRiichi });
    }
    if (canWin(human.hand, human.melds.length)) {
      actions.push({ labelKey: "tsumo", cls: "win", onClick: () => winHand(0, 0, "Tsumo") });
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
  const river = player.discards.map(tile => tileHtml(tile, true)).join("");

  if (seat === 0) {
    return `
      <div class="human-table">
        ${hand}
        <div class="human-public">
          ${renderTileLane(t("melds"), "melds", melds)}
          ${renderTileLane(t("river"), "river", river)}
        </div>
      </div>
    `;
  }

  return `
    ${hand}
    ${melds ? renderTileLane(t("melds"), "melds", melds) : ""}
    ${renderTileLane(t("river"), "river", river)}
  `;
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
  return player.melds.map(m => m.tiles.map(tile => tileHtml(tile, true)).join("")).join("");
}

function renderTileLane(label, className, content) {
  return `
    <div class="tile-lane">
      <div class="section-label">${label}</div>
      <div class="${className}">${content}</div>
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
  return `
    <div id="winReveal" class="win-reveal" aria-live="polite">
      <div class="section-label">${t("winningHand")} · ${winner}</div>
      <div class="win-hand">${handTiles}${meldTiles ? `<span class="win-divider"></span>${meldTiles}` : ""}</div>
    </div>
  `;
}

function renderHand(player, seat) {
  if (seat !== 0) {
    const backs = player.hand.map(() => `<span class="tile small back">?</span>`).join("");
    return `<div class="concealed">${backs}</div>`;
  }
  const drawnIndex = state.turn === 0 && state.pendingDiscard && !state.gameOver && player.drawnTile
    ? player.hand.lastIndexOf(player.drawnTile)
    : -1;
  const handButtons = player.hand
    .map((tile, index) => ({ tile, index }))
    .filter(entry => entry.index !== drawnIndex)
    .map(entry => tileButton(entry.tile, entry.index))
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

function tileButton(tile, index, extraClass = "") {
    const disabled = state.turn !== 0 || !state.pendingDiscard || state.gameOver ? "disabled" : "";
    const title = t("discardTitle", { tile: tileName(tile) });
    return `<button type="button" class="tile ${extraClass} ${tileClass(tile)}" data-tile-index="${index}" ${disabled} title="${title}" aria-label="${title}">${tileFaceText(tile)}</button>`;
}

function bindHumanTiles() {
  document.querySelectorAll("[data-tile-index]").forEach(button => {
    button.addEventListener("click", () => discardTile(0, Number(button.dataset.tileIndex)), { once: true });
  });
}

function tileHtml(tile, small = false, winning = false) {
  return `<span class="tile ${small ? "small" : ""} ${winning ? "winning" : ""} ${tileClass(tile)}" title="${tileName(tile)}" aria-label="${tileName(tile)}">${tileFaceText(tile)}</span>`;
}

function tileFaceText(tile) {
  if (tile === "Wh") return "";
  return tileText(tile);
}

function tileText(tile) {
  if (!tile) return "--";
  if (TILE_LABELS[tile]) return TILE_LABELS[tile];
  return tile[0] + tile[1].toUpperCase();
}

function tileName(tile) {
  if (!tile) return t("noTile");
  if (currentLanguage === "pt" && HONOR_NAMES_PT[tile]) return HONOR_NAMES_PT[tile];
  if (HONOR_NAMES[tile]) return HONOR_NAMES[tile];
  return `${Number(tile[0])} ${currentLanguage === "pt" ? "de" : "of"} ${I18N[currentLanguage].suits[tile[1]]}`;
}

function tileClass(tile) {
  if (!tile) return "";
  if (tile.endsWith("s")) return "bamboo";
  if (tile.endsWith("p")) return "pin";
  if (tile.endsWith("m")) return "man";
  if (tile === "G") return "honor green";
  if (tile === "R") return "honor red";
  return "honor";
}

function isSuit(tile) {
  return SUITS.includes(tile?.[1]);
}

state.format = normalizeFormat(getStoredPreference(FORMAT_STORAGE_KEY));
els.formatSelect.value = state.format;
applyLanguage();
startMatch();
if (shouldShowWelcome()) {
  openWelcome(false);
}
