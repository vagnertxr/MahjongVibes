const SUITS = ["m", "p", "s"];
const WINDS = ["East", "South", "West", "North"];
const HONORS = ["E", "S", "W", "N", "Wh", "G", "R"];
const NAMES = ["You", "Cartola", "Alcione", "Adoniran"];
const RIVER_ROW_SIZE = 6;
const STAGE_W = 1280;
const STAGE_H = 720;
const DEAD_WALL_STACKS = 7;
const REPLACEMENT_STACKS = 2;
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
const DRAGONS = ["Wh", "G", "R"];
const WIND_TILES = ["E", "S", "W", "N"];
const GREEN_TILES = ["2s", "3s", "4s", "6s", "8s", "G"];
const KOKUSHI_TILES = ["1m", "9m", "1p", "9p", "1s", "9s", "E", "S", "W", "N", "Wh", "G", "R"];
const YAKUMAN_HAN = 13;

const WELCOME_STORAGE_KEY = "mahjong-vibes-hide-welcome";
const LANGUAGE_STORAGE_KEY = "mahjong-vibes-language";
const FORMAT_STORAGE_KEY = "mahjong-vibes-format";
const SOUND_STORAGE_KEY = "mahjong-vibes-sound";
const SFX = {
  discard: new Audio("assets/sfx/discard.ogg"),
  call: new Audio("assets/sfx/call.ogg"),
  riichi: new Audio("assets/sfx/riichi.ogg"),
  win: new Audio("assets/sfx/win.ogg"),
  shuffle: new Audio("assets/sfx/shuffle.ogg")
};
Object.values(SFX).forEach(audio => {
  audio.preload = "auto";
  audio.volume = 0.5;
});
const MATCH_FORMATS = {
  tonpuusen: { key: "tonpuusen", rounds: 4 },
  hanchan: { key: "hanchan", rounds: 8 }
};
const I18N = {
  en: {
    lang: "en",
    langButton: "🇧🇷",
    langTitle: "Mudar para Português",
    muteSound: "Mute sound",
    unmuteSound: "Unmute sound",
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
    matchLength: "Match length",
    tonpuusen: "Tonpuusen",
    hanchan: "Hanchan",
    tonpuusenDesc: "East only, four hands",
    hanchanDesc: "East and South, eight hands",
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
    hideWelcome: "Skip this setup next time and use my last choice",
    creditsPrefix: "Created by ",
    lastDiscard: "Last discard",
    winningHand: "Winning hand",
    loading: "Loading table...",
    dealer: "Dealer",
    river: "River",
    riverOf: "{player}'s river",
    yourRiver: "Your river",
    doraTile: "Dora: {tile}",
    doraWord: "Dora",
    indicator: "Indicator",
    indicatorMeans: "Dora indicator {indicator}, so the dora is {dora}",
    deadWall: "Dead wall",
    roundWindOf: "{wind}, the round wind",
    deadWallTile: "Face-down dead wall tile",
    deadWallOf: "Dead wall, {count} indicator(s) revealed",
    honba: "{count} honba",
    tableSticks: "{riichi} riichi stick(s) and {honba} honba on the table",
    discardNumber: "Discard {n}",
    tsumogiri: "Drawn and discarded",
    riichiTile: "Riichi declaration tile",
    melds: "Melds",
    riichi: "Riichi",
    furiten: "Furiten",
    tenpaiBadge: "Tenpai",
    tsumo: "Tsumo",
    ron: "Ron",
    pass: "Pass",
    pon: "Pon",
    chi: "Chi {tiles}",
    kan: "Kan {tile}",
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
    callKan: "You call Kan on {tile}. A new tile is drawn.",
    wins: "{player} {winVerb} by {type}: {hand} for {points} points.",
    exhaustiveDraw: "Exhaustive draw. Nobody completed a winning hand before the wall ran out.",
    matchComplete: "{player} {winVerb} the {format} after {round}.",
    declareRiichi: "You declare Riichi. Discard to lock in the chase.",
    declareKan: "You declare Kan on {tile}. A new tile is drawn.",
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
      `<h3>6. Dora, Defense, and First Tips</h3><p>Dora increase points after you win. The face-up tile in the dead wall is an indicator, not the bonus itself: the dora is the next tile in order, so a 4 of circles points at the 5, a 9 wraps back to the 1, and North wraps back to East. Hover the indicator to see what it points at. Declaring a kan flips another one.</p><p>Defense matters because Ron punishes the discarder. When another player looks threatening, safer discards are usually tiles they have already discarded or honors that are visibly exhausted.</p><p>Good beginner habits: keep useful sequences, avoid breaking pairs too early, do not call every tile, and remember that a closed hand can declare riichi. If your hand has no obvious yaku, staying closed and aiming for riichi is often the simplest plan.</p>`,
      `<h3>7. Match Formats</h3><p><strong>Tonpuusen</strong> is an East-only match: East 1 through East 4. <strong>Hanchan</strong> plays East and South: East 1 through South 4.</p><p>The dealer repeats the same hand after a dealer win. Other wins and exhaustive draws advance the dealer and hand number.</p><p>At the scheduled end, the match finishes when the leader has at least 30,000 points. If nobody has reached that mark, play continues into the next wind until someone leads with 30,000 or more. The match also ends immediately if any player drops below 0 points.</p>`
    ]
  },
  pt: {
    lang: "pt-BR",
    langButton: "🇬🇧",
    langTitle: "Switch to English",
    muteSound: "Silenciar som",
    unmuteSound: "Ativar som",
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
    matchLength: "Duração da partida",
    tonpuusen: "Tonpuusen",
    hanchan: "Hanchan",
    tonpuusenDesc: "Só Leste, quatro mãos",
    hanchanDesc: "Leste e Sul, oito mãos",
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
    hideWelcome: "Pular esta preparação na próxima vez e usar minha última escolha",
    creditsPrefix: "Criado por ",
    lastDiscard: "Último descarte",
    winningHand: "Mão vencedora",
    loading: "Carregando mesa...",
    dealer: "Oya",
    river: "Rio",
    riverOf: "Rio de {player}",
    yourRiver: "Seu rio",
    doraTile: "Dora: {tile}",
    doraWord: "Dora",
    indicator: "Indicador",
    indicatorMeans: "Indicador de dora {indicator}, então o dora é {dora}",
    deadWall: "Muro morto",
    roundWindOf: "{wind}, o vento da rodada",
    deadWallTile: "Peça virada do muro morto",
    deadWallOf: "Muro morto, {count} indicador(es) revelado(s)",
    honba: "{count} honba",
    tableSticks: "{riichi} palito(s) de riichi e {honba} honba na mesa",
    discardNumber: "Descarte {n}",
    tsumogiri: "Comprada e descartada",
    riichiTile: "Peça de declaração de riichi",
    melds: "Chamadas",
    riichi: "Riichi",
    furiten: "Furiten",
    tenpaiBadge: "Tenpai",
    tsumo: "Tsumo",
    ron: "Ron",
    pass: "Passar",
    pon: "Pon",
    chi: "Chi {tiles}",
    kan: "Kan {tile}",
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
    callKan: "Você chama Kan em {tile}. Uma nova peça é comprada.",
    wins: "{player} {winVerb} por {type}: {hand}, {points} pontos.",
    exhaustiveDraw: "Empate exaustivo. Ninguém completou uma mão antes do muro acabar.",
    matchComplete: "{player} {winVerb} o {format} após {round}.",
    declareRiichi: "Você declara Riichi. Descarte para travar a espera.",
    declareKan: "Você declara Kan em {tile}. Uma nova peça é comprada.",
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
      `<h3>6. Dora, Defesa e Primeiras Dicas</h3><p>Dora aumenta os pontos depois que você vence. A peça virada para cima no muro morto é um indicador, não o bônus em si: o dora é a próxima peça na ordem, então um 4 de círculos aponta para o 5, o 9 volta para o 1 e o Norte volta para o Leste. Passe o mouse no indicador para ver para onde ele aponta. Declarar um kan vira mais um.</p><p>Defesa importa porque Ron pune quem descartou. Quando alguém parece perigoso, descartes mais seguros costumam ser peças que essa pessoa já descartou ou honras que você já viu esgotadas.</p><p>Bons hábitos iniciais: mantenha sequências úteis, não quebre pares cedo demais, não chame todas as peças e lembre que uma mão fechada pode declarar riichi. Se sua mão não tem yaku claro, ficar fechado e mirar riichi costuma ser o plano mais simples.</p>`
      ,
      `<h3>7. Formatos de Partida</h3><p><strong>Tonpuusen</strong> é uma partida só de Leste: Leste 1 até Leste 4. <strong>Hanchan</strong> joga Leste e Sul: Leste 1 até Sul 4.</p><p>O dealer repete a mesma mão depois de uma vitória do dealer. Outras vitórias e empates exaustivos avançam o dealer e o número da mão.</p><p>No fim programado, a partida termina quando o líder tem pelo menos 30.000 pontos. Se ninguém chegou a essa marca, o jogo continua para o próximo vento até alguém liderar com 30.000 ou mais. A partida também termina imediatamente se qualquer jogador ficar abaixo de 0 ponto.</p>`
    ]
  }
};
const YAKU_NAMES = {
  doubleRiichi: { en: "Double Riichi", pt: "Riichi Duplo" },
  riichi: { en: "Riichi", pt: "Riichi" },
  ippatsu: { en: "Ippatsu", pt: "Ippatsu" },
  menzenTsumo: { en: "Menzen Tsumo", pt: "Menzen Tsumo" },
  haitei: { en: "Haitei Raoyue", pt: "Haitei Raoyue" },
  houtei: { en: "Houtei Raoyui", pt: "Houtei Raoyui" },
  rinshan: { en: "Rinshan Kaihou", pt: "Rinshan Kaihou" },
  chankan: { en: "Chankan", pt: "Chankan" },
  tenhou: { en: "Tenhou", pt: "Tenhou" },
  chiihou: { en: "Chiihou", pt: "Chiihou" },
  tanyao: { en: "Tanyao", pt: "Tanyao" },
  honitsu: { en: "Honitsu", pt: "Honitsu" },
  chinitsu: { en: "Chinitsu", pt: "Chinitsu" },
  tsuuiisou: { en: "Tsuuiisou", pt: "Tsuuiisou" },
  chinroutou: { en: "Chinroutou", pt: "Chinroutou" },
  ryuuiisou: { en: "Ryuuiisou", pt: "Ryuuiisou" },
  suukantsu: { en: "Suukantsu", pt: "Suukantsu" },
  chuurenPoutou: { en: "Chuuren Poutou", pt: "Chuuren Poutou" },
  chuurenPoutouPure: { en: "Pure Chuuren Poutou", pt: "Chuuren Poutou Puro" },
  pinfu: { en: "Pinfu", pt: "Pinfu" },
  yakuhai: { en: "Yakuhai", pt: "Yakuhai" },
  iipeiko: { en: "Iipeiko", pt: "Iipeiko" },
  sanshokuDoujun: { en: "Sanshoku Doujun", pt: "Sanshoku Doujun" },
  sanshokuDoukou: { en: "Sanshoku Doukou", pt: "Sanshoku Doukou" },
  ittsuu: { en: "Ittsuu", pt: "Ittsuu" },
  junchan: { en: "Junchan", pt: "Junchan" },
  chanta: { en: "Chanta", pt: "Chanta" },
  toitoi: { en: "Toitoi", pt: "Toitoi" },
  sanankou: { en: "Sanankou", pt: "Sanankou" },
  shousangen: { en: "Shousangen", pt: "Shousangen" },
  daisangen: { en: "Daisangen", pt: "Daisangen" },
  shousuushii: { en: "Shousuushii", pt: "Shousuushii" },
  daisuushii: { en: "Daisuushii", pt: "Daisuushii" },
  suuankou: { en: "Suuankou", pt: "Suuankou" },
  kokushi: { en: "Kokushi Musou", pt: "Kokushi Musou" },
  kokushiJuusanmen: { en: "Kokushi Musou (13-wait)", pt: "Kokushi Musou (espera de 13)" },
  chiitoitsu: { en: "Chiitoitsu", pt: "Chiitoitsu" },
  dora: { en: "Dora", pt: "Dora" },
  uraDora: { en: "Ura Dora", pt: "Ura Dora" }
};

function yakuDisplayName(entry) {
  if (entry.labelTile) {
    return `${YAKU_NAMES.yakuhai[currentLanguage]} (${tileName(entry.labelTile)})`;
  }
  return YAKU_NAMES[entry.key]?.[currentLanguage] ?? entry.key;
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
  players: []
};

const els = {
  roundLabel: document.querySelector("#roundLabel"),
  wallCount: document.querySelector("#wallCount"),
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
let currentRulesPage = 0;
let currentLanguage = getStoredPreference(LANGUAGE_STORAGE_KEY) === "pt" ? "pt" : "en";
let soundEnabled = getStoredPreference(SOUND_STORAGE_KEY) !== "0";
let selectedFormat = normalizeFormat(getStoredPreference(FORMAT_STORAGE_KEY));

// A new match is set up before it is dealt, the way you pick a table before
// sitting at it. Changing the format used to silently wipe the hand in progress.
els.newGameBtn.addEventListener("click", () => openWelcome(false));
els.formatCards.forEach(card => {
  card.addEventListener("click", () => selectFormat(card.dataset.format));
});
els.soundBtn.addEventListener("click", toggleSound);
els.langBtn.addEventListener("click", toggleLanguage);
els.welcomeLangBtn.addEventListener("click", toggleLanguage);
els.rulesBtn.addEventListener("click", () => openWelcome(true));
els.closeWelcomeBtn.addEventListener("click", closeWelcome);
els.startPlayingBtn.addEventListener("click", startSelectedMatch);
els.showRulesBtn.addEventListener("click", toggleRules);
els.prevRulesBtn.addEventListener("click", () => setRulesPage(currentRulesPage - 1));
els.nextRulesBtn.addEventListener("click", () => setRulesPage(currentRulesPage + 1));
els.welcomeOverlay.addEventListener("click", event => {
  if (event.target === els.welcomeOverlay) closeWelcome();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !els.welcomeOverlay.hidden) closeWelcome();
});

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

function ankanOptions(hand) {
  const counts = countTiles(hand);
  return Object.keys(counts).filter(tile => counts[tile] === 4);
}

function kakanOptions(player) {
  const counts = countTiles(player.hand);
  return player.melds
    .filter(meld => meld.type === "pon" && counts[meld.tiles[0]] >= 1)
    .map(meld => meld.tiles[0]);
}

function legalAnkanOptions(player) {
  if (player.riichiDeclaring) return [];
  const options = ankanOptions(player.hand);
  if (!player.riichi) return options;
  return options.filter(tile => tile === player.drawnTile && riichiAnkanPreservesWait(player, tile));
}

function riichiAnkanPreservesWait(player, tile) {
  const drawnIndex = player.hand.lastIndexOf(player.drawnTile);
  const preDrawHand = [...player.hand.slice(0, drawnIndex), ...player.hand.slice(drawnIndex + 1)];
  const preWaits = getWaits(preDrawHand, player.melds.length);
  const postHand = preDrawHand.filter(t => t !== tile);
  const postWaits = getWaits(postHand, player.melds.length + 1);
  return sameTileSet(preWaits, postWaits);
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

// --- Full-decomposition engine (used for yaku/fu scoring, not tenpai checks) ---
// Unlike canMakeGroups (which only asks "is this possible?"), this collects every
// distinct way to break the concealed tiles into groups, since different readings
// of the same hand can qualify for different yaku (e.g. pinfu vs. an alternate
// triplet reading), and real scoring always picks whichever reading scores highest.

function enumerateGroupings(counts, groupsLeft) {
  if (groupsLeft === 0) {
    return Object.values(counts).every(n => n === 0) ? [[]] : [];
  }
  const tile = TILE_ORDER.find(t => counts[t] > 0);
  if (!tile) return [];
  const results = [];

  if (counts[tile] >= 3) {
    counts[tile] -= 3;
    for (const rest of enumerateGroupings(counts, groupsLeft - 1)) {
      results.push([{ type: "triplet", tiles: [tile, tile, tile] }, ...rest]);
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
      for (const rest of enumerateGroupings(counts, groupsLeft - 1)) {
        results.push([{ type: "sequence", tiles: [tile, t2, t3] }, ...rest]);
      }
      counts[tile] += 1;
      counts[t2] += 1;
      counts[t3] += 1;
    }
  }

  return results;
}

function enumerateHandDecompositions(concealedTiles, groupsNeeded) {
  const counts = countTiles(concealedTiles);
  const decompositions = [];
  const pairCandidates = [...new Set(concealedTiles)].filter(t => counts[t] >= 2);
  for (const pairTile of pairCandidates) {
    counts[pairTile] -= 2;
    for (const groups of enumerateGroupings(counts, groupsNeeded)) {
      decompositions.push({ pair: pairTile, groups });
    }
    counts[pairTile] += 2;
  }
  return decompositions;
}

function meldToGroup(meld) {
  if (meld.type === "chi") {
    const sorted = [...meld.tiles].sort((a, b) => Number(a[0]) - Number(b[0]));
    return { type: "sequence", tiles: sorted, concealed: false, kan: false, meld };
  }
  if (meld.type === "pon") {
    return { type: "triplet", tiles: meld.tiles.slice(0, 3), concealed: false, kan: false, meld };
  }
  if (meld.type === "ankan") {
    return { type: "triplet", tiles: meld.tiles.slice(0, 3), concealed: true, kan: true, meld };
  }
  // minkan and kakan are both open kans: kakan is a pon upgraded by adding the
  // player's own 4th tile, but it was never concealed (the first 3 came from a call).
  return { type: "triplet", tiles: meld.tiles.slice(0, 3), concealed: false, kan: true, meld };
}

// --- Yaku / fu / score engine ---
// evaluateWin(concealedHand, melds, context) is the single entry point: it tries
// every legal way to read the hand (every decomposition x every way the winning
// tile could complete it) and returns whichever reading scores highest, or null
// if no reading has a yaku at all (a shape with no yaku cannot legally win).

function removeOne(tiles, tile) {
  const index = tiles.indexOf(tile);
  return [...tiles.slice(0, index), ...tiles.slice(index + 1)];
}

function seatWindTile(seat) {
  return WIND_TILES[(seat - state.dealer + 4) % 4];
}

function roundWindTile() {
  return WIND_TILES[Math.floor(state.round / 4) % 4];
}

function countMatchingTiles(tiles, targetList) {
  return tiles.filter(t => targetList.includes(t)).length;
}

function waitTypeForSequence(seqTiles, winTile) {
  const nums = seqTiles.map(t => Number(t[0])).sort((a, b) => a - b);
  const winN = Number(winTile[0]);
  if (winN === nums[1]) return "kanchan";
  if (winN === nums[2] && nums[0] === 1) return "penchan";
  if (winN === nums[0] && nums[2] === 9) return "penchan";
  return "ryanmen";
}

function findCompletionCandidates(fullGroups, pair, winTile) {
  const candidates = [];
  if (pair === winTile) candidates.push({ kind: "pair" });
  for (const group of fullGroups) {
    if (group.meld) continue; // pre-existing melds can't be "completed" by the winning tile
    if (!group.tiles.includes(winTile)) continue;
    if (group.type === "triplet") {
      candidates.push({ kind: "triplet", group });
    } else {
      candidates.push({ kind: "sequence", group, waitType: waitTypeForSequence(group.tiles, winTile) });
    }
  }
  return candidates;
}

function isPinfuComposition(fullGroups, pair, completion, isOpen, context) {
  return !isOpen
    && fullGroups.every(g => g.type === "sequence")
    && pairFu(pair, context) === 0
    && completion.kind === "sequence" && completion.waitType === "ryanmen";
}

function pairFu(pairTile, context) {
  let fu = 0;
  if (DRAGONS.includes(pairTile)) fu += 2;
  if (pairTile === context.seatWindTile) fu += 2;
  if (pairTile === context.roundWindTile) fu += 2;
  return fu;
}

function waitFu(completion) {
  if (completion.kind === "pair") return 2;
  if (completion.kind === "sequence") return completion.waitType === "ryanmen" ? 0 : 2;
  return 0;
}

function groupFu(group, completion, isTsumo) {
  if (group.type === "sequence") return 0;
  const isKan = !!group.kan;
  let concealed = group.meld ? !!group.concealed : true;
  if (!group.meld && completion.kind === "triplet" && completion.group === group) {
    concealed = isTsumo; // ron "opens" the triplet it completes, even in a closed hand
  }
  const valueTile = isTerminalOrHonor(group.tiles[0]);
  let base = valueTile ? 4 : 2;
  if (concealed) base *= 2;
  if (isKan) base *= 4;
  return base;
}

function computeFu(fullGroups, pair, completion, isOpen, isTsumo, context) {
  let fu = 20;
  for (const group of fullGroups) fu += groupFu(group, completion, isTsumo);
  fu += pairFu(pair, context);
  fu += waitFu(completion);
  if (isTsumo) {
    if (!isPinfuComposition(fullGroups, pair, completion, isOpen, context)) fu += 2;
  } else if (!isOpen) {
    fu += 10; // menzen ron bonus
  } else if (fu === 20) {
    fu = 30; // open, otherwise-zero-fu hand ("kuipinfu") floors to 30
  }
  return Math.ceil(fu / 10) * 10;
}

function baseScorePoints(han, fu) {
  if (han >= 11) return 6000; // sanbaiman
  if (han >= 8) return 4000; // baiman
  if (han >= 6) return 3000; // haneman
  if (han === 5) return 2000; // mangan
  return Math.min(fu * Math.pow(2, 2 + han), 2000);
}

function roundUp100(n) {
  return Math.ceil(n / 100) * 100;
}

function computeScore(han, fu, isDealer, isTsumo) {
  const yakumanUnits = han >= YAKUMAN_HAN ? Math.round(han / YAKUMAN_HAN) : 0;
  const base = yakumanUnits > 0 ? 8000 * yakumanUnits : baseScorePoints(han, fu);
  if (isTsumo) {
    if (isDealer) {
      const each = roundUp100(base * 2);
      return { total: each * 3, dealerPay: 0, otherPay: each };
    }
    const dealerPay = roundUp100(base * 2);
    const otherPay = roundUp100(base * 1);
    return { total: dealerPay + otherPay * 2, dealerPay, otherPay };
  }
  const mult = isDealer ? 6 : 4;
  const total = roundUp100(base * mult);
  return { total, loserPay: total };
}

function detectGlobalYaku(allTiles, meldGroups, isOpen, context) {
  const yaku = [];
  if (context.isDoubleRiichi) yaku.push({ key: "doubleRiichi", han: 2 });
  else if (context.isRiichi) yaku.push({ key: "riichi", han: 1 });
  if (context.isIppatsu && context.isRiichi) yaku.push({ key: "ippatsu", han: 1 });
  if (context.isTsumo && !isOpen) yaku.push({ key: "menzenTsumo", han: 1 });
  if (context.isHaitei) yaku.push({ key: "haitei", han: 1 });
  if (context.isHoutei) yaku.push({ key: "houtei", han: 1 });
  if (context.isRinshan) yaku.push({ key: "rinshan", han: 1 });
  if (context.isChankan) yaku.push({ key: "chankan", han: 1 });
  if (context.isTenhou) yaku.push({ key: "tenhou", han: YAKUMAN_HAN, yakuman: true });
  if (context.isChiihou) yaku.push({ key: "chiihou", han: YAKUMAN_HAN, yakuman: true });
  if (allTiles.every(isSimple)) yaku.push({ key: "tanyao", han: 1 });

  const suits = new Set(allTiles.filter(isSuit).map(tileSuit));
  const hasHonor = allTiles.some(isHonor);
  if (suits.size === 1) {
    if (hasHonor) yaku.push({ key: "honitsu", han: isOpen ? 2 : 3 });
    else yaku.push({ key: "chinitsu", han: isOpen ? 5 : 6 });
  }

  if (allTiles.every(isHonor)) yaku.push({ key: "tsuuiisou", han: YAKUMAN_HAN, yakuman: true });
  if (allTiles.every(isTerminal)) yaku.push({ key: "chinroutou", han: YAKUMAN_HAN, yakuman: true });
  if (allTiles.every(t => GREEN_TILES.includes(t))) yaku.push({ key: "ryuuiisou", han: YAKUMAN_HAN, yakuman: true });

  if (meldGroups.filter(g => g.kan).length === 4) yaku.push({ key: "suukantsu", han: YAKUMAN_HAN, yakuman: true });

  if (!isOpen && suits.size === 1 && !hasHonor) {
    const suit = [...suits][0];
    const required = { 1: 3, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 3 };
    const counts = countTiles(allTiles);
    const meetsMinimum = Object.keys(required).every(n => (counts[`${n}${suit}`] ?? 0) >= required[n]);
    if (meetsMinimum) {
      const preCounts = countTiles(removeOne(allTiles, context.winTile));
      const isPure = Object.keys(required).every(n => (preCounts[`${n}${suit}`] ?? 0) === required[n]);
      yaku.push({ key: isPure ? "chuurenPoutouPure" : "chuurenPoutou", han: isPure ? YAKUMAN_HAN * 2 : YAKUMAN_HAN, yakuman: true });
    }
  }

  return yaku;
}

function detectGroupYaku(fullGroups, pair, completion, isOpen, context) {
  const yaku = [];
  const yakuman = [];
  const allTriplets = fullGroups.every(g => g.type === "triplet");

  if (isPinfuComposition(fullGroups, pair, completion, isOpen, context)) {
    yaku.push({ key: "pinfu", han: 1 });
  }

  for (const group of fullGroups) {
    if (group.type !== "triplet") continue;
    const t = group.tiles[0];
    if (DRAGONS.includes(t)) yaku.push({ key: `yakuhai_${t}`, labelTile: t, han: 1 });
    if (t === context.seatWindTile) yaku.push({ key: "yakuhaiSeat", labelTile: t, han: 1 });
    if (t === context.roundWindTile) yaku.push({ key: "yakuhaiRound", labelTile: t, han: 1 });
  }

  if (!isOpen) {
    const seqKeys = fullGroups.filter(g => g.type === "sequence").map(g => g.tiles.join(","));
    const seen = new Set();
    for (const key of seqKeys) {
      if (seen.has(key)) { yaku.push({ key: "iipeiko", han: 1 }); break; }
      seen.add(key);
    }
  }

  const seqNumsBySuit = { m: new Set(), p: new Set(), s: new Set() };
  const tripNumsBySuit = { m: new Set(), p: new Set(), s: new Set() };
  for (const g of fullGroups) {
    if (!isSuit(g.tiles[0])) continue;
    const suit = g.tiles[0][1];
    if (g.type === "sequence") seqNumsBySuit[suit].add(g.tiles.map(t => t[0]).join(""));
    else tripNumsBySuit[suit].add(g.tiles[0][0]);
  }
  if ([...seqNumsBySuit.m].some(n => seqNumsBySuit.p.has(n) && seqNumsBySuit.s.has(n))) {
    yaku.push({ key: "sanshokuDoujun", han: isOpen ? 1 : 2 });
  }
  if ([...tripNumsBySuit.m].some(n => tripNumsBySuit.p.has(n) && tripNumsBySuit.s.has(n))) {
    yaku.push({ key: "sanshokuDoukou", han: 2 });
  }
  for (const suit of SUITS) {
    const nums = seqNumsBySuit[suit];
    if (nums.has("123") && nums.has("456") && nums.has("789")) {
      yaku.push({ key: "ittsuu", han: isOpen ? 1 : 2 });
      break;
    }
  }

  const groupsHaveTerminalOrHonor = fullGroups.every(g => g.tiles.some(isTerminalOrHonor));
  const pairHasTerminalOrHonor = isTerminalOrHonor(pair);
  if (groupsHaveTerminalOrHonor && pairHasTerminalOrHonor) {
    const anyHonorUsed = fullGroups.some(g => g.tiles.some(isHonor)) || isHonor(pair);
    const hasSequence = fullGroups.some(g => g.type === "sequence");
    if (!anyHonorUsed) yaku.push({ key: "junchan", han: isOpen ? 2 : 3 });
    else if (hasSequence) yaku.push({ key: "chanta", han: isOpen ? 1 : 2 });
  }

  if (allTriplets) yaku.push({ key: "toitoi", han: 2 });

  const concealedTripletCount = fullGroups.filter(g => {
    if (g.type !== "triplet") return false;
    if (g.meld) return !!g.concealed;
    return !(completion.kind === "triplet" && completion.group === g && !context.isTsumo);
  }).length;
  if (concealedTripletCount >= 3) yaku.push({ key: "sanankou", han: 2 });

  const dragonTripletCount = fullGroups.filter(g => g.type === "triplet" && DRAGONS.includes(g.tiles[0])).length;
  const dragonPair = DRAGONS.includes(pair);
  if (dragonTripletCount === 3) {
    yakuman.push({ key: "daisangen", han: YAKUMAN_HAN, yakuman: true });
  } else if (dragonTripletCount === 2 && dragonPair) {
    yaku.push({ key: "shousangen", han: 2 });
  }

  const windTripletCount = fullGroups.filter(g => g.type === "triplet" && WIND_TILES.includes(g.tiles[0])).length;
  const windPair = WIND_TILES.includes(pair);
  if (windTripletCount === 4) {
    yakuman.push({ key: "daisuushii", han: YAKUMAN_HAN, yakuman: true });
  } else if (windTripletCount === 3 && windPair) {
    yakuman.push({ key: "shousuushii", han: YAKUMAN_HAN, yakuman: true });
  }

  if (concealedTripletCount === 4) {
    yakuman.push({ key: "suuankou", han: completion.kind === "pair" ? YAKUMAN_HAN * 2 : YAKUMAN_HAN, yakuman: true });
  }

  return { yaku, yakuman };
}

function finalizeScore(yakuList, fu, context) {
  const yakumanEntries = yakuList.filter(y => y.yakuman);
  if (yakumanEntries.length > 0) {
    const han = yakumanEntries.reduce((sum, y) => sum + y.han, 0);
    const score = computeScore(han, fu, context.isDealer, context.isTsumo);
    return { han, fu, yakuList: yakumanEntries, points: score.total, score, isYakuman: true };
  }
  if (yakuList.length === 0) return null;
  const uraDoraCount = context.isRiichi ? context.uraDoraCount : 0;
  const han = yakuList.reduce((sum, y) => sum + y.han, 0) + context.doraCount + uraDoraCount;
  const score = computeScore(han, fu, context.isDealer, context.isTsumo);
  const fullYakuList = [...yakuList];
  if (context.doraCount > 0) fullYakuList.push({ key: "dora", han: context.doraCount });
  if (uraDoraCount > 0) fullYakuList.push({ key: "uraDora", han: uraDoraCount });
  return { han, fu, yakuList: fullYakuList, points: score.total, score, isYakuman: false };
}

function evaluateKokushi(concealedHand, context) {
  if (concealedHand.length !== 14) return null;
  if (!concealedHand.every(t => KOKUSHI_TILES.includes(t))) return null;
  if (Object.keys(countTiles(concealedHand)).length !== 13) return null;
  const preWinHand = removeOne(concealedHand, context.winTile);
  const isThirteenWait = new Set(preWinHand).size === 13;
  const han = isThirteenWait ? YAKUMAN_HAN * 2 : YAKUMAN_HAN;
  return finalizeScore([{ key: isThirteenWait ? "kokushiJuusanmen" : "kokushi", han, yakuman: true }], 25, context);
}

function evaluateChiitoitsu(concealedHand, context) {
  const globalYaku = detectGlobalYaku(concealedHand, [], false, context);
  return finalizeScore([...globalYaku, { key: "chiitoitsu", han: 2 }], 25, context);
}

function evaluateWin(concealedHand, melds, context) {
  const isOpen = melds.some(m => m.type !== "ankan");
  const meldGroups = melds.map(meldToGroup);

  if (melds.length === 0) {
    const kokushi = evaluateKokushi(concealedHand, context);
    if (kokushi) return kokushi;
  }

  let best = null;
  const consider = result => {
    if (result && (!best || result.points > best.points)) best = result;
  };

  if (melds.length === 0 && isSevenPairs(concealedHand)) {
    consider(evaluateChiitoitsu(concealedHand, context));
  }

  const allTiles = [...concealedHand, ...melds.flatMap(m => m.tiles)];
  const globalYaku = detectGlobalYaku(allTiles, meldGroups, isOpen, context);
  const neededGroups = 4 - melds.length;
  const decompositions = enumerateHandDecompositions(concealedHand, neededGroups);

  for (const decomposition of decompositions) {
    const fullGroups = [...meldGroups, ...decomposition.groups];
    const candidates = findCompletionCandidates(fullGroups, decomposition.pair, context.winTile);
    for (const completion of candidates) {
      const { yaku: groupYaku, yakuman: groupYakuman } = detectGroupYaku(fullGroups, decomposition.pair, completion, isOpen, context);
      const fu = computeFu(fullGroups, decomposition.pair, completion, isOpen, context.isTsumo, context);
      consider(finalizeScore([...globalYaku, ...groupYaku, ...groupYakuman], fu, context));
    }
  }

  return best;
}

function canActuallyWin(player, winTile, context) {
  const concealedHand = context.isTsumo ? player.hand : [...player.hand, winTile];
  return evaluateWin(concealedHand, player.melds, { ...context, winTile }) !== null;
}

function getWaits(hand, openMeldCount) {
  const waits = [];
  for (const tile of TILE_ORDER) {
    if (canWin([...hand, tile], openMeldCount)) waits.push(tile);
  }
  return waits;
}

function isTenpai(hand, openMeldCount) {
  return getWaits(hand, openMeldCount).length > 0;
}

function canDeclareRiichi(hand, openMeldCount) {
  const uniqueTiles = [...new Set(hand)];
  return uniqueTiles.some(tile => {
    const index = hand.indexOf(tile);
    const remaining = [...hand.slice(0, index), ...hand.slice(index + 1)];
    return isTenpai(remaining, openMeldCount);
  });
}

function sameTileSet(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((tile, index) => tile === sortedB[index]);
}

// A flipped tile is an indicator, not the bonus itself: the dora is the next
// tile in its own sequence, wrapping 9 back to 1, North back to East and Red
// back to White.
function doraFromIndicator(indicator) {
  if (!indicator) return null;
  if (isSuit(indicator)) {
    const n = Number(indicator[0]);
    return `${n === 9 ? 1 : n + 1}${indicator[1]}`;
  }
  const winds = ["E", "S", "W", "N"];
  const dragons = ["Wh", "G", "R"];
  const cycle = winds.includes(indicator) ? winds : dragons;
  return cycle[(cycle.indexOf(indicator) + 1) % cycle.length];
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

function guideTiles(tiles) {
  return tiles.map(tile => `<span class="tile small ${tileClass(tile)}">${tileImage(tile)}</span>`).join("");
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
    els.actionBar.insertAdjacentHTML("beforebegin", renderWinReveal());
  }

  state.players.forEach((player, seat) => {
    const seatEl = els.seats[seat];
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

    const riverEl = els.riverBlocks[seat];
    if (riverEl) {
      riverEl.setAttribute("aria-label", seat === 0 ? t("yourRiver") : t("riverOf", { player: NAMES[seat] }));
      riverEl.innerHTML = renderRiver(player, seat);
    }
  });

  if (state.turn === 0 && state.pendingDiscard && !state.gameOver) {
    const actions = [];
    const human = state.players[0];
    if (!human.riichi && human.melds.length === 0 && human.score >= 1000 && state.wall.length >= 4
      && canDeclareRiichi(human.hand, human.melds.length)) {
      actions.push({ labelKey: "riichi", onClick: declareRiichi });
    }
    for (const tile of legalAnkanOptions(human)) {
      actions.push({ labelKey: "kan", labelParams: { tile: tileText(tile) }, onClick: () => declareAnkan(tile) });
    }
    if (!human.riichi) {
      for (const tile of kakanOptions(human)) {
        actions.push({ labelKey: "kan", labelParams: { tile: tileText(tile) }, onClick: () => declareKakan(tile) });
      }
    }
    if (canWin(human.hand, human.melds.length) && checkWin(0, "Tsumo", human.drawnTile)) {
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

  if (seat === 0) {
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

function renderWinReveal() {
  const winner = playerLabel(state.win.winner);
  const handTiles = state.win.hand.map((tile, index) => {
    const isWinTile = state.win.tile && index === state.win.hand.lastIndexOf(state.win.tile);
    return tileHtml(tile, true, isWinTile);
  }).join("");
  const meldTiles = state.win.melds.flat().map(tile => tileHtml(tile, true)).join("");
  const evaluation = state.win.evaluation;
  const yakuLines = evaluation
    ? evaluation.yakuList.map(y => `<li>${yakuDisplayName(y)}${y.yakuman ? "" : ` · ${y.han}han`}</li>`).join("")
    : "";
  const scoreLine = evaluation
    ? `<div class="win-score">${evaluation.isYakuman ? "" : `${evaluation.han}han ${evaluation.fu}fu · `}${evaluation.points.toLocaleString()} ${t("points")}</div>`
    : "";
  return `
    <div id="winReveal" class="win-reveal" aria-live="polite">
      <div class="section-label">${t("winningHand")} · ${winner}</div>
      <div class="win-hand">${handTiles}${meldTiles ? `<span class="win-divider"></span>${meldTiles}` : ""}</div>
      ${yakuLines ? `<ul class="win-yaku-list">${yakuLines}</ul>` : ""}
      ${scoreLine}
    </div>
  `;
}

function renderHand(player, seat) {
  if (seat !== 0) {
    // Side seats stack their backs into a narrow standing column, the way a real
    // table looks from across it. That frees the board corners for the plates.
    const orientation = seat === 1 || seat === 3 ? " standing" : "";
    const backs = player.hand.map(() => tileBackHtml(true)).join("");
    return `<div class="concealed${orientation}">${backs}</div>`;
  }
  const drawnIndex = state.turn === 0 && state.pendingDiscard && !state.gameOver && player.drawnTile
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
    const disabled = forceDisabled || state.turn !== 0 || !state.pendingDiscard || state.gameOver ? "disabled" : "";
    const title = t("discardTitle", { tile: tileName(tile) });
    return `<button type="button" class="tile ${extraClass} ${tileClass(tile)}" data-tile-index="${index}" ${disabled} title="${title}" aria-label="${title}">${tileImage(tile)}</button>`;
}

function bindHumanTiles() {
  document.querySelectorAll("[data-tile-index]").forEach(button => {
    button.addEventListener("click", () => discardTile(0, Number(button.dataset.tileIndex)), { once: true });
  });
}

function tileHtml(tile, small = false, winning = false, recent = false) {
  return `<span class="tile ${small ? "small" : ""} ${winning ? "winning" : ""} ${recent ? "recent" : ""} ${tileClass(tile)}" title="${tileName(tile)}" aria-label="${tileName(tile)}">${tileImage(tile)}</span>`;
}

function tileBackHtml(small = true) {
  return `<span class="tile ${small ? "small" : ""} back">${tileImage(null)}</span>`;
}

function tileImage(tile) {
  return `<img class="tile-face" src="${tileImageSrc(tile)}" alt="" draggable="false">`;
}

function tileImageSrc(tile) {
  const key = tile || "back";
  return `assets/tiles/${key}.svg`;
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

function isHonor(tile) {
  return HONORS.includes(tile);
}

function isTerminal(tile) {
  return isSuit(tile) && (tile[0] === "1" || tile[0] === "9");
}

function isTerminalOrHonor(tile) {
  return isTerminal(tile) || isHonor(tile);
}

function isSimple(tile) {
  return !isTerminalOrHonor(tile);
}

function tileSuit(tile) {
  return isSuit(tile) ? tile[1] : null;
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

window.addEventListener("resize", fitStage);
window.addEventListener("orientationchange", fitStage);
// A ResizeObserver on the root catches what plain resize events miss: browser
// zoom steps and a mobile URL bar sliding in and out.
if (typeof ResizeObserver === "function") {
  new ResizeObserver(fitStage).observe(document.documentElement);
}
window.visualViewport?.addEventListener("resize", fitStage);

selectFormat(selectedFormat);
applyLanguage();
fitStage();
// Deal immediately so the setup screen opens over a live table rather than an
// empty one. Confirming the setup deals again with whatever format was picked.
startMatch();
if (shouldShowWelcome()) {
  openWelcome(false);
}
