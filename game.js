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
const SAVE_STORAGE_KEY = "mahjong-vibes-save";
const NAME_STORAGE_KEY = "mahjong-vibes-name";
const DEVICE_STORAGE_KEY = "mahjong-vibes-device";
const SAVE_SCHEMA_VERSION = 1;
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
    yakuList: "Yaku List",
    yakuListTitle: "Open yaku list",
    closeYakuTitle: "Close yaku list",
    confirmAbandonMatch: "This ends the match in progress and deals a new one. Continue?",
    lan: "Network",
    lanTitle: "Play over the local network",
    lanHeading: "Local Network",
    lanIntro: "Create a room and read the address out to the others, or type the address of a phone that already has one. Once they are in, start the match: anyone missing is replaced by a bot.",
    lanIntroGuestOnly: "Type the address of the phone holding the table. Only the installed app can hold a room; from a browser you can join one.",
    lanCreateRoom: "Create Room",
    lanJoinRoom: "Join Room",
    lanLeave: "Disconnect",
    lanOpening: "Opening the room...",
    lanJoining: "Reaching the table...",
    lanHosting: "Room open at {address}:{port}. Others type that in.",
    lanJoined: "Connected to {address}.",
    lanFailed: "{reason}",
    lanDisconnected: "The connection dropped.",
    lanClosed: "Disconnected.",
    lanPeerJoined: "Someone connected ({id}).",
    lanPeerLeft: "{id} disconnected.",
    lanStartMatch: "Start Shared Match",
    lanPlayersConnected: "{count} player(s) connected. Empty chairs get a bot.",
    lanTableRunning: "Shared match on, with {count} guest(s) at the table.",
    lanSeated: "Seated at the host's table.",
    lanWaitingForHost: "Waiting for the host",
    lanHostName: "Host",
    lanGuestName: "Player {n}",
    lanTheHost: "the host",
    resultWinner: "{player} won",
    resultDraw: "Exhaustive draw",
    resultTenpai: "Tenpai: {names}",
    resultNoTenpai: "Nobody was tenpai",
    resultMatchOver: "Match over",
    lanNameLabel: "Your name",
    lanNamePlaceholder: "Name shown at the table",
    lanSeatHost: "{name} (host)",
    lanSeatYou: "{label} — you",
    lanSeatBot: "{name} (bot)",
    lanSeatOpen: "Empty — a bot plays",
    lanSeatAway: "{name} — away; a bot plays until they return",
    lanWaitingCount: "{count} waiting for a chair.",
    lanGuestWaitingStart: "Waiting for {host} to start the match.",
    lanGuestWaitingHand: "A match is under way. You will be dealt in at the next hand with a free chair.",
    lanGuestSeatedAt: "Seated at {host}'s table.",
    lanRejoined: "{name} is back at the table.",
    yakuIntro: "Every yaku this table scores. A winning shape still needs at least one of them. Han values are for a closed hand; where a hand opens for less, the open value is in brackets.",
    yakuLuck: "How the hand was won",
    yakuShape: "What the hand is made of",
    yakuman: "Yakuman",
    yakuBonus: "Bonus, not yaku",
    yakuClosed: "closed only",
    yakuOpenValue: "{han} open",
    yakuHan: "{han} han",
    yakuManLabel: "Yakuman",
    yakuDesc: {
      riichi: "Closed and one tile from winning. Costs 1,000 points, which the next winner sweeps.",
      doubleRiichi: "Riichi declared on your very first discard, with no call before it.",
      ippatsu: "Winning within one go-around of your riichi, before any call interrupts it.",
      menzenTsumo: "Drawing your own winning tile with a closed hand.",
      haitei: "Winning on the very last tile drawn from the wall.",
      houtei: "Winning on the very last discard of the hand.",
      rinshan: "Winning on the replacement tile drawn after your kan.",
      chankan: "Robbing the tile another player adds to their pon to make a kan.",
      tanyao: "No terminals, no winds, no dragons: 2 through 8 only.",
      yakuhai: "A triplet of dragons, of your seat wind, or of the round wind. Each one counts.",
      pinfu: "Closed, all sequences, a pair worth no yaku, and a two-sided wait.",
      iipeiko: "Two identical sequences in the same suit, closed.",
      sanshokuDoujun: "The same sequence in all three suits.",
      ittsuu: "1-2-3, 4-5-6 and 7-8-9 in a single suit.",
      chanta: "Every group and the pair contains a terminal or an honour.",
      junchan: "Every group and the pair contains a terminal, with no honours at all.",
      toitoi: "Four triplets and a pair, no sequences.",
      sanankou: "Three triplets drawn without calling them.",
      sanshokuDoukou: "The same triplet in all three suits.",
      shousangen: "Two dragon triplets plus a pair of the third.",
      chiitoitsu: "Seven different pairs instead of four groups and a pair.",
      honitsu: "One suit plus honours, nothing else.",
      chinitsu: "A single suit, with no honours at all.",
      tenhou: "The dealer's opening hand is already complete.",
      chiihou: "A non-dealer completes the hand on their first draw.",
      daisangen: "Triplets of all three dragons.",
      shousuushii: "Triplets of three winds plus a pair of the fourth.",
      daisuushii: "Triplets of all four winds.",
      tsuuiisou: "Nothing but winds and dragons.",
      chinroutou: "Nothing but 1s and 9s.",
      ryuuiisou: "Nothing but green: 2, 3, 4, 6, 8 of bamboo and the green dragon.",
      suukantsu: "Four kan in one hand.",
      suuankou: "Four triplets, none of them called.",
      chuurenPoutou: "1112345678999 in one suit, plus any tile of it, closed.",
      kokushi: "One of each terminal and honour, plus a second of any, closed.",
      dora: "Bonus han from indicated tiles. Dora alone cannot win a hand.",
      uraDora: "Extra indicators revealed under the dora, for a winner who declared riichi."
    },
    yakumanSuuankou: "Double if the win completes the pair.",
    yakumanChuuren: "Double if the hand waits on all nine tiles.",
    yakumanKokushi: "Double if the hand waits on all thirteen.",
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
    dealerStartsSelf: "You deal. Draw and discard to chase Mahjong Vibes.",
    playerDraws: "{player} draws.",
    playerDrawsSelf: "You draw.",
    playerDiscards: "{player} discards {tile}.",
    playerDiscardsSelf: "You discard {tile}.",
    callPon: "{player} calls Pon on {tile}.",
    callPonSelf: "You call Pon on {tile}. Discard a tile.",
    callChi: "{player} calls Chi.",
    callChiSelf: "You call Chi. Discard a tile.",
    callKan: "{player} calls Kan on {tile}.",
    callKanSelf: "You call Kan on {tile}. A new tile is drawn.",
    wins: "{player} {winVerb} by {type}: {hand} for {points} points.",
    exhaustiveDraw: "Exhaustive draw. Nobody completed a winning hand before the wall ran out.",
    matchComplete: "{player} {winVerb} the {format} after {round}.",
    declareRiichi: "{player} declares Riichi.",
    declareRiichiSelf: "You declare Riichi. Discard to lock in the chase.",
    declareKan: "{player} declares Kan on {tile}.",
    declareKanSelf: "You declare Kan on {tile}. A new tile is drawn.",
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
    yakuList: "Lista de Yaku",
    yakuListTitle: "Abrir lista de yaku",
    closeYakuTitle: "Fechar lista de yaku",
    confirmAbandonMatch: "Isto encerra a partida em andamento e distribui uma nova. Continuar?",
    lan: "Rede",
    lanTitle: "Jogar pela rede local",
    lanHeading: "Rede Local",
    lanIntro: "Crie uma sala e diga o endereço em voz alta para os outros, ou digite o endereço de um celular que já criou uma. Com todos dentro, comece a partida: quem faltar vira bot.",
    lanIntroGuestOnly: "Digite o endereço do celular que está com a mesa. Só o app instalado consegue manter uma sala; pelo navegador dá para entrar em uma.",
    lanCreateRoom: "Criar Sala",
    lanJoinRoom: "Entrar na Sala",
    lanLeave: "Desconectar",
    lanOpening: "Abrindo a sala...",
    lanJoining: "Procurando a mesa...",
    lanHosting: "Sala aberta em {address}:{port}. É isso que os outros digitam.",
    lanJoined: "Conectado a {address}.",
    lanFailed: "{reason}",
    lanDisconnected: "A conexão caiu.",
    lanClosed: "Desconectado.",
    lanPeerJoined: "Alguém conectou ({id}).",
    lanPeerLeft: "{id} desconectou.",
    lanStartMatch: "Começar Partida em Rede",
    lanPlayersConnected: "{count} jogador(es) conectado(s). Cadeiras vazias ficam com um bot.",
    lanTableRunning: "Partida em rede em andamento, com {count} convidado(s) à mesa.",
    lanSeated: "Sentado à mesa do anfitrião.",
    lanWaitingForHost: "Aguardando o anfitrião",
    lanHostName: "Anfitrião",
    lanGuestName: "Jogador {n}",
    lanTheHost: "o anfitrião",
    resultWinner: "{player} venceu",
    resultDraw: "Empate exaustivo",
    resultTenpai: "Tenpai: {names}",
    resultNoTenpai: "Ninguém estava em tenpai",
    resultMatchOver: "Fim da partida",
    lanNameLabel: "Seu nome",
    lanNamePlaceholder: "Nome que aparece na mesa",
    lanSeatHost: "{name} (anfitrião)",
    lanSeatYou: "{label} — você",
    lanSeatBot: "{name} (bot)",
    lanSeatOpen: "Vazia — um bot joga",
    lanSeatAway: "{name} — saiu; um bot joga até voltar",
    lanWaitingCount: "{count} aguardando uma cadeira.",
    lanGuestWaitingStart: "Aguardando {host} começar a partida.",
    lanGuestWaitingHand: "Há uma partida em andamento. Você entra na próxima mão que tiver cadeira livre.",
    lanGuestSeatedAt: "Sentado à mesa de {host}.",
    lanRejoined: "{name} voltou à mesa.",
    yakuIntro: "Todos os yaku que esta mesa pontua. Uma mão completa ainda precisa de pelo menos um deles. Os han valem para mão fechada; quando abrir a mão reduz o valor, o valor aberto vem entre colchetes.",
    yakuLuck: "Como a mão foi vencida",
    yakuShape: "Do que a mão é feita",
    yakuman: "Yakuman",
    yakuBonus: "Bônus, não é yaku",
    yakuClosed: "só fechada",
    yakuOpenValue: "{han} aberta",
    yakuHan: "{han} han",
    yakuManLabel: "Yakuman",
    yakuDesc: {
      riichi: "Mão fechada e a uma peça de vencer. Custa 1.000 pontos, que o próximo vencedor recolhe.",
      doubleRiichi: "Riichi declarado já no seu primeiro descarte, sem nenhuma chamada antes.",
      ippatsu: "Vencer dentro de uma volta do seu riichi, antes que alguma chamada interrompa.",
      menzenTsumo: "Comprar a própria peça da vitória com a mão fechada.",
      haitei: "Vencer na última peça comprada do muro.",
      houtei: "Vencer no último descarte da mão.",
      rinshan: "Vencer na peça de reposição comprada depois do seu kan.",
      chankan: "Roubar a peça que outra pessoa acrescenta ao pon dela para fazer kan.",
      tanyao: "Sem terminais, sem ventos e sem dragões: só do 2 ao 8.",
      yakuhai: "Trinca de dragão, do seu vento ou do vento da rodada. Cada uma conta.",
      pinfu: "Fechada, só sequências, par sem valor e espera dos dois lados.",
      iipeiko: "Duas sequências idênticas do mesmo naipe, com a mão fechada.",
      sanshokuDoujun: "A mesma sequência nos três naipes.",
      ittsuu: "1-2-3, 4-5-6 e 7-8-9 em um único naipe.",
      chanta: "Todo grupo e o par contêm um terminal ou uma honra.",
      junchan: "Todo grupo e o par contêm um terminal, sem nenhuma honra.",
      toitoi: "Quatro trincas e um par, nenhuma sequência.",
      sanankou: "Três trincas compradas sem chamar.",
      sanshokuDoukou: "A mesma trinca nos três naipes.",
      shousangen: "Duas trincas de dragão mais um par do terceiro.",
      chiitoitsu: "Sete pares diferentes em vez de quatro grupos e um par.",
      honitsu: "Um único naipe mais honras, nada além disso.",
      chinitsu: "Um único naipe, sem nenhuma honra.",
      tenhou: "A mão inicial do dealer já vem completa.",
      chiihou: "Quem não é dealer completa a mão na primeira compra.",
      daisangen: "Trincas dos três dragões.",
      shousuushii: "Trincas de três ventos mais um par do quarto.",
      daisuushii: "Trincas dos quatro ventos.",
      tsuuiisou: "Só ventos e dragões.",
      chinroutou: "Só 1 e 9.",
      ryuuiisou: "Só verde: 2, 3, 4, 6, 8 de bambu e o dragão verde.",
      suukantsu: "Quatro kan na mesma mão.",
      suuankou: "Quatro trincas, nenhuma delas chamada.",
      chuurenPoutou: "1112345678999 em um naipe, mais qualquer peça dele, com a mão fechada.",
      kokushi: "Um de cada terminal e honra, mais um segundo de qualquer um, com a mão fechada.",
      dora: "Han de bônus das peças indicadas. Dora sozinho não vence uma mão.",
      uraDora: "Indicadores extras revelados sob o dora, para quem venceu tendo declarado riichi."
    },
    yakumanSuuankou: "Dobrado se a vitória completa o par.",
    yakumanChuuren: "Dobrado se a mão espera nas nove peças.",
    yakumanKokushi: "Dobrado se a mão espera nas treze.",
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
    callPon: "{player} chama Pon em {tile}.",
    callPonSelf: "Você chama Pon em {tile}. Descarte uma peça.",
    callChi: "{player} chama Chi.",
    callChiSelf: "Você chama Chi. Descarte uma peça.",
    callKan: "{player} chama Kan em {tile}.",
    callKanSelf: "Você chama Kan em {tile}. Uma nova peça é comprada.",
    wins: "{player} {winVerb} por {type}: {hand}, {points} pontos.",
    exhaustiveDraw: "Empate exaustivo. Ninguém completou uma mão antes do muro acabar.",
    matchComplete: "{player} {winVerb} o {format} após {round}.",
    declareRiichi: "{player} declara Riichi.",
    declareRiichiSelf: "Você declara Riichi. Descarte para travar a espera.",
    declareKan: "{player} declara Kan em {tile}.",
    declareKanSelf: "Você declara Kan em {tile}. Uma nova peça é comprada.",
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

// Every yaku this game actually scores, in the order the reference screen shows
// them. `han` is what scoreHand awards; `openHan` is the reduced value for an
// open hand, and `closed` marks the ones an open hand cannot have at all.
// Keep this in step with scoreHand: it is a description of that function, and a
// yaku listed here that the code never awards is a lie to the player.
const YAKU_REFERENCE = [
  {
    section: "yakuLuck",
    items: [
      { key: "riichi", han: 1, closed: true },
      { key: "doubleRiichi", han: 2, closed: true },
      { key: "ippatsu", han: 1, closed: true },
      { key: "menzenTsumo", han: 1, closed: true },
      { key: "haitei", han: 1 },
      { key: "houtei", han: 1 },
      { key: "rinshan", han: 1 },
      { key: "chankan", han: 1 }
    ]
  },
  {
    section: "yakuShape",
    items: [
      { key: "tanyao", han: 1 },
      { key: "yakuhai", han: 1 },
      { key: "pinfu", han: 1, closed: true },
      { key: "iipeiko", han: 1, closed: true },
      { key: "sanshokuDoujun", han: 2, openHan: 1 },
      { key: "ittsuu", han: 2, openHan: 1 },
      { key: "chanta", han: 2, openHan: 1 },
      { key: "junchan", han: 3, openHan: 2 },
      { key: "toitoi", han: 2 },
      { key: "sanankou", han: 2 },
      { key: "sanshokuDoukou", han: 2 },
      { key: "shousangen", han: 2 },
      { key: "chiitoitsu", han: 2, closed: true },
      { key: "honitsu", han: 3, openHan: 2 },
      { key: "chinitsu", han: 6, openHan: 5 }
    ]
  },
  {
    section: "yakuman",
    items: [
      { key: "tenhou" },
      { key: "chiihou" },
      { key: "daisangen" },
      { key: "shousuushii" },
      { key: "daisuushii" },
      { key: "tsuuiisou" },
      { key: "chinroutou" },
      { key: "ryuuiisou" },
      { key: "suukantsu" },
      { key: "suuankou", double: "yakumanSuuankou" },
      { key: "chuurenPoutou", closed: true, double: "yakumanChuuren" },
      { key: "kokushi", closed: true, double: "yakumanKokushi" }
    ]
  },
  {
    section: "yakuBonus",
    items: [
      { key: "dora" },
      { key: "uraDora" }
    ]
  }
];

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
  pendingAction: null,
  players: []
};

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
  yakuListBtn: document.querySelector("#yakuListBtn"),
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
  lanBtn: document.querySelector("#lanBtn"),
  lanOverlay: document.querySelector("#lanOverlay"),
  lanTitle: document.querySelector("#lanTitle"),
  lanIntro: document.querySelector("#lanIntro"),
  lanHostBtn: document.querySelector("#lanHostBtn"),
  lanAddress: document.querySelector("#lanAddress"),
  lanJoinBtn: document.querySelector("#lanJoinBtn"),
  lanStatus: document.querySelector("#lanStatus"),
  lanLog: document.querySelector("#lanLog"),
  lanStartBtn: document.querySelector("#lanStartBtn"),
  lanPeers: document.querySelector("#lanPeers"),
  lanSeats: document.querySelector("#lanSeats"),
  lanName: document.querySelector("#lanName"),
  lanNameLabel: document.querySelector("#lanNameLabel"),
  lanLeaveBtn: document.querySelector("#lanLeaveBtn"),
  closeLanBtn: document.querySelector("#closeLanBtn"),
  yakuOverlay: document.querySelector("#yakuOverlay"),
  yakuOverlayTitle: document.querySelector("#yakuOverlayTitle"),
  yakuOverlayContent: document.querySelector("#yakuOverlayContent"),
  closeYakuBtn: document.querySelector("#closeYakuBtn"),
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
els.yakuListBtn.addEventListener("click", openYakuList);
els.closeYakuBtn.addEventListener("click", closeYakuList);
els.lanBtn.addEventListener("click", openLanPanel);
els.closeLanBtn.addEventListener("click", closeLanPanel);
els.lanHostBtn.addEventListener("click", hostLanRoom);
els.lanJoinBtn.addEventListener("click", joinLanRoom);
els.lanStartBtn.addEventListener("click", startSharedMatch);
els.lanName.addEventListener("change", onNameChanged);
els.lanLeaveBtn.addEventListener("click", leaveLanRoom);
els.lanOverlay.addEventListener("click", event => {
  if (event.target === els.lanOverlay) closeLanPanel();
});
els.closeWelcomeBtn.addEventListener("click", closeWelcome);
els.startPlayingBtn.addEventListener("click", startSelectedMatch);
els.showRulesBtn.addEventListener("click", toggleRules);
els.prevRulesBtn.addEventListener("click", () => setRulesPage(currentRulesPage - 1));
els.nextRulesBtn.addEventListener("click", () => setRulesPage(currentRulesPage + 1));
els.welcomeOverlay.addEventListener("click", event => {
  if (event.target === els.welcomeOverlay) closeWelcome();
});
els.yakuOverlay.addEventListener("click", event => {
  if (event.target === els.yakuOverlay) closeYakuList();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !els.welcomeOverlay.hidden) closeWelcome();
  if (event.key === "Escape" && !els.yakuOverlay.hidden) closeYakuList();
  if (event.key === "Escape" && !els.lanOverlay.hidden) closeLanPanel();
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
  // Dealing again throws away a match that is already underway, so ask first
  // once there is real progress to lose. An untouched opening table has none.
  if (matchHasProgress() && !window.confirm(t("confirmAbandonMatch"))) return;
  setStoredPreference(FORMAT_STORAGE_KEY, selectedFormat);
  closeWelcome();
  startMatch();
}

function matchHasProgress() {
  if (state.matchOver || state.players.length === 0) return false;
  return state.round > 0 || state.honba > 0 || state.discardCount > 0;
}

function updateFormatChip() {
  els.formatLabel.textContent = t(state.format);
  els.formatLabel.title = t("formatTitle");
}

// Who owns each chair. The device holding the table always sits at seat 0, so a
// solo match is simply a table whose other three chairs are bots. Guests are
// seated by the host when a match over the network begins.
const SOLO_SEATS = [{ controller: "host" }, { controller: "bot" }, { controller: "bot" }, { controller: "bot" }];

function currentSeats() {
  return lanTable?.seats ?? SOLO_SEATS;
}

function controllerOf(seat) {
  return state.players[seat]?.controller ?? (seat === 0 ? "host" : "bot");
}

function isBotSeat(seat) {
  return controllerOf(seat) === "bot";
}

function isHumanSeat(seat) {
  return !isBotSeat(seat);
}

// Every pause the table takes — a bot thinking, a ron about to land — goes
// through here. Anything that swaps the table out from under a pending timer
// (a new hand, joining someone else's room) bumps the epoch, and the stale
// timer then fires into nothing instead of acting on a table it was not meant for.
let tableEpoch = 0;

function schedule(callback, delay) {
  const epoch = tableEpoch;
  setTimeout(() => {
    if (epoch === tableEpoch) callback();
  }, delay);
}

function startMatch() {
  if (isGuest()) return;
  if (!lanTable) clearSavedGame();
  // A new match frees the chairs held for people who left during the last one.
  releaseReservedSeats();
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
  if (isGuest()) return;
  if (state.matchOver) {
    startMatch();
    return;
  }
  tableEpoch += 1;
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
  state.pendingAction = null;
  seatWaitingGuests();
  const seats = currentSeats();
  state.players = Array.from({ length: 4 }, (_, i) => ({
    // A person's own name, or none and a label is made up for them; a bot is
    // always its bot, even in a chair being kept for someone who left.
    name: seats[i].controller === "bot" ? NAMES[i] : (seats[i].name ?? null),
    // The absolute chair number. A guest's view is rotated so they sit at index
    // 0, and this is what still tells them "Player 3" is the one across.
    seat: i,
    controller: seats[i].controller,
    clientId: seats[i].clientId ?? null,
    wind: WINDS[(i - state.dealer + 4) % 4],
    score: state.players[i]?.score ?? 25000,
    // What they sat down to the hand with; the result card shows the change.
    handStartScore: state.players[i]?.score ?? 25000,
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
  if (lanTable) broadcastLobby();
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
  if (isGuest()) return;
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

  // A human's turn needs nothing armed: the table already shows them as owing a
  // discard, on whichever device they are holding.
  if (isBotSeat(state.turn)) {
    state.pendingAction = { type: "awaitingBotTurn", seat: state.turn };
    syncTable();
    schedule(botDiscard, 550);
  }
}

function discardTile(seat, tileIndex) {
  if (isGuest()) return;
  if (state.gameOver || !state.pendingDiscard || seat !== state.turn) return;
  // The hand is about to change shape, so a remembered index would point at a
  // different tile than the one the player raised.
  if (seat === 0) selectedTileIndex = null;
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
  resolveDiscardClaims(tile, seat, []);
}

// A discard can be claimed, and with more than one person at the table more
// than one of them may want it. Ron is asked first, in turn order from the
// discarder; then pon and kan; then chi, which only the next seat may make.
// `passedRon` carries the seats that already let a ron go on this tile, so the
// next one in line still gets their chance.
function resolveDiscardClaims(tile, fromSeat, passedRon) {
  const ronSeat = findRon(tile, fromSeat, {}, passedRon);
  if (ronSeat !== null) {
    if (isHumanSeat(ronSeat)) {
      offerHumanRon(ronSeat, fromSeat, passedRon);
      return;
    }
    state.pendingAction = { type: "awaitingBotRon", winner: ronSeat, loser: fromSeat };
    syncTable();
    schedule(() => winHand(ronSeat, fromSeat, "Ron"), 650);
    return;
  }

  const claimants = callClaimants(tile, fromSeat);
  if (claimants.length > 0) {
    offerCall(tile, fromSeat, claimants);
    return;
  }

  state.pendingAction = { type: "awaitingNextTurn" };
  syncTable();
  schedule(nextTurn, 450);
}

function offerHumanRon(winner, loser, passed = []) {
  state.pendingAction = { type: "awaitingHumanRon", winner, loser, passed };
  refreshTable();
}

// The first claimant is asked; the rest wait in the queue and are asked in turn
// if they pass. Nobody sees the queue but the host, since knowing who else can
// call a tile is knowing something about their hand.
function offerCall(tile, fromSeat, claimants) {
  const [seat, ...queue] = claimants;
  state.pendingAction = { type: "awaitingHumanCall", seat, tile, fromSeat, queue };
  refreshTable();
}

function callClaimants(tile, fromSeat) {
  const ponOrKan = [];
  const chiOnly = [];
  for (let offset = 1; offset < 4; offset += 1) {
    const seat = (fromSeat + offset) % 4;
    if (isBotSeat(seat)) continue;
    const player = state.players[seat];
    if (player.riichi) continue;
    const same = player.hand.filter(t => t === tile).length;
    if (same >= 2) ponOrKan.push(seat);
    else if (offset === 1 && chiOptions(player.hand, tile).length > 0) chiOnly.push(seat);
  }
  return [...ponOrKan, ...chiOnly];
}

function passOffer(seat) {
  const pending = state.pendingAction;
  if (!pending || state.gameOver) return;
  if (pending.type === "awaitingHumanRon" && pending.winner === seat) {
    state.pendingAction = null;
    resolveDiscardClaims(state.lastDiscard, pending.loser, [...(pending.passed ?? []), seat]);
    return;
  }
  if (pending.type === "awaitingHumanCall" && pending.seat === seat) {
    state.pendingAction = null;
    if (pending.queue?.length) offerCall(pending.tile, pending.fromSeat, pending.queue);
    else nextTurn();
  }
}

function findRon(tile, fromSeat, extra = {}, skip = []) {
  for (let offset = 1; offset < 4; offset += 1) {
    const seat = (fromSeat + offset) % 4;
    if (skip.includes(seat)) continue;
    const player = state.players[seat];
    if (!canWin([...player.hand, tile], player.melds.length)) continue;
    if (isFuriten(player)) continue;
    if (checkWin(seat, "Ron", tile, extra)) return seat;
  }
  return null;
}

// What a seat may do with someone else's discard. The same list drives the
// buttons a player sees and the check the host runs on what they send back, so
// a guest cannot claim a call the table would not have offered them.
function callOptions(seat, tile, fromSeat) {
  const player = state.players[seat];
  const same = player.hand.filter(t => t === tile).length;
  return {
    kan: same >= 3,
    pon: same >= 2,
    chi: seat === (fromSeat + 1) % 4 ? chiOptions(player.hand, tile) : []
  };
}

function callPon(seat, tile, fromSeat) {
  state.pendingAction = null;
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
  state.pendingAction = null;
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

function declareAnkan(seat, tile) {
  const player = state.players[seat];
  if (state.turn !== seat || !state.pendingDiscard || state.gameOver || !legalAnkanOptions(player).includes(tile)) return;
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
  if (state.turn !== seat || !state.pendingDiscard || state.gameOver || player.riichi
    || !kakanOptions(player).includes(tile)) return;
  // Robbing a kan is taken automatically, for a person as for a bot. Declining
  // a ron this good is vanishingly rare, and offering it would need the kan to
  // be resumable halfway through.
  const chankanSeat = findRon(tile, seat, { isChankan: true });
  if (chankanSeat !== null) {
    removeTiles(player.hand, [tile]);
    state.lastDiscard = tile;
    state.lastDiscardFrom = seat;
    state.pendingAction = { type: "awaitingChankan", winner: chankanSeat, loser: seat };
    syncTable();
    schedule(() => winHand(chankanSeat, seat, "Ron", { isChankan: true }), 400);
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
  state.pendingAction = null;
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
  if (isGuest()) return;
  // Checked before touching the action bar: a timer arriving after the hand has
  // ended would otherwise wipe its "Next Hand" button.
  if (state.gameOver) return;
  state.pendingAction = null;
  clearActions();
  state.turn = (state.lastDiscardFrom + 1) % 4;
  drawForTurn();
}

function botDiscard() {
  state.pendingAction = null;
  if (state.gameOver || !isBotSeat(state.turn)) return;
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
  if (isGuest()) return;
  state.pendingAction = null;
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
  if (isGuest()) return;
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
    // A table shared over the network is never saved, so the save on this
    // device is a solo match it must not throw away.
    if (!lanTable) clearSavedGame();
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

function declareRiichi(seat) {
  const player = state.players[seat];
  if (state.turn !== seat || !state.pendingDiscard || state.gameOver || player.riichi) return;
  if (player.melds.length > 0 || player.score < 1000) return;
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
  const key = actions.map(a => `${a.labelKey}:${(a.tiles ?? []).join("")}`).join("|");
  const pop = key !== "" && key !== shownActionsKey;
  shownActionsKey = key;
  els.actionBar.innerHTML = "";
  [...actions]
    .sort((a, b) => actionRank(a.labelKey) - actionRank(b.labelKey))
    .forEach(action => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = [action.cls ?? "", action.labelKey ? `act-${action.labelKey}` : "", pop ? "pop" : ""]
        .filter(Boolean)
        .join(" ");
      button.textContent = (action.labelKey ? t(action.labelKey, action.labelParams) : action.label).trim();
      // A call names its tiles by showing them: "Chi" and a 4 and 6 of bamboo
      // reads at a glance where "Chi 4S6S" has to be decoded.
      if (action.tiles?.length) {
        const tiles = document.createElement("span");
        tiles.className = "act-tiles";
        tiles.setAttribute("aria-label", action.tiles.map(tileName).join(", "));
        tiles.innerHTML = action.tiles.map(tile => `<span class="act-tile">${tileImage(tile)}</span>`).join("");
        button.append(tiles);
      }
      if (action.disabled) button.disabled = true;
      else button.addEventListener("click", action.onClick);
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

// The same message reads differently to the one it is about ("You call Pon")
// and to everyone else ("Player 3 calls Pon"). Seat 0 is whoever is reading,
// so that is all it takes to pick. Saves from before messages carried a seat
// only ever described the player themselves, so no seat reads as theirs.
function formatMessage(key, params = {}) {
  const aboutReader = params.playerSeat === undefined || params.playerSeat === 0;
  const selfKey = `${key}Self`;
  const chosen = aboutReader && I18N[currentLanguage][selfKey] !== undefined ? selfKey : key;
  return t(chosen, localizeMessageParams(key, params));
}

function localizeMessageParams(key, params) {
  const localized = { ...params };
  if (Number.isInteger(params.playerSeat)) {
    localized.player = playerLabel(params.playerSeat);
  }
  if (Number.isFinite(params.points)) localized.points = formatPoints(params.points);
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
  if (seat === 0) return t("you");
  const player = state.players[seat];
  if (player?.controller === "host") return player.name ?? t("lanHostName");
  if (player?.controller === "guest") return player.name ?? t("lanGuestName", { n: (player.seat ?? seat) + 1 });
  return player?.name ?? NAMES[seat];
}

// For the few places a player's name goes into markup. Names are typed on other
// people's phones; "<img onerror=...>" must arrive as those characters.
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
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
  els.yakuListBtn.textContent = copy.yakuList;
  els.yakuListBtn.title = copy.yakuListTitle;
  els.lanBtn.textContent = copy.lan;
  els.lanBtn.title = copy.lanTitle;
  els.lanTitle.textContent = copy.lanHeading;
  els.closeLanBtn.textContent = copy.close;
  els.lanHostBtn.textContent = copy.lanCreateRoom;
  els.lanJoinBtn.textContent = copy.lanJoinRoom;
  els.lanStartBtn.textContent = copy.lanStartMatch;
  els.lanNameLabel.textContent = copy.lanNameLabel;
  els.lanName.placeholder = copy.lanNamePlaceholder;
  els.lanLeaveBtn.textContent = copy.lanLeave;
  updateLanPanel();
  els.yakuOverlayTitle.textContent = copy.yakuList;
  els.closeYakuBtn.textContent = copy.close;
  els.closeYakuBtn.title = copy.closeYakuTitle;
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
  renderYakuOverlay();
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
  // Opened via the "Rules" toolbar button, this dialog is reference-only:
  // hide the match setup controls so it can never wipe a hand in progress.
  els.welcomeOverlay.classList.toggle("rules-only", showRules);
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

// Playing over the local network. One device holds the table and is the only
// one that runs the game; the others are shown a view of it and send back what
// their player wants to do. The panel opens a room, lets others in, and starts
// a match with whoever is connected, seating bots in any empty chair.
let lanConnection = null;
// Host side, while a shared match is on: who sits where.
let lanTable = null;
// Guest side, while seated at somebody else's table.
let guestTable = null;
let viewSeq = 0;

function isGuest() {
  return guestTable !== null;
}

// Called whenever the table settles: keep the solo save current, and send every
// guest their view of it. Both are no-ops when they do not apply.
function syncTable() {
  saveGame();
  broadcastViews();
}

// For the moments the table changes without a full redraw: an offer made, a
// claim passed on.
function refreshTable() {
  renderActionBar();
  syncTable();
}

function broadcastViews() {
  if (!lanTable || lanConnection?.kind !== "host") return;
  viewSeq += 1;
  state.players.forEach((player, seat) => {
    if (player.controller !== "guest" || !player.clientId) return;
    const message = { type: "view", seq: viewSeq, view: tableViewFor(state, seat) };
    Promise.resolve(lanConnection.room.send(player.clientId, message)).catch(() => {
      // They are gone; peerLeft hands their chair to a bot.
    });
  });
}

function rotateSeat(value, seat) {
  return Number.isInteger(value) ? (value - seat + 4) % 4 : value;
}

// What one guest is allowed to know about the table, turned so that their own
// chair is seat 0. Turning the data rather than the drawing means the whole
// renderer, which has always assumed "you are seat 0", works unchanged on a guest.
//
// Concealment happens here, in the data. Hiding a bot's hand used to be only a
// matter of not drawing it, but anything sent over the wire can be read off it,
// so every hand but the recipient's goes out as blanks, and so do the wall and
// the dead wall. Their lengths survive: the wall counter and haitei need them.
function tableViewFor(source, seat) {
  const view = JSON.parse(JSON.stringify(source));
  const turned = value => rotateSeat(value, seat);
  view.players.forEach((player, index) => {
    if (index !== seat) {
      player.hand = player.hand.map(() => null);
      player.drawnTile = null;
    }
    player.clientId = null;
    player.discards.forEach(entry => { entry.calledBy = turned(entry.calledBy); });
    player.melds.forEach(meld => { meld.from = turned(meld.from); });
  });
  view.players = [0, 1, 2, 3].map(index => view.players[(index + seat) % 4]);
  view.wall = view.wall.map(() => null);
  view.deadWall = view.deadWall.map(() => null);
  view.turn = turned(view.turn);
  view.dealer = turned(view.dealer);
  view.lastDiscardFrom = turned(view.lastDiscardFrom);
  view.drawTenpaiSeats = view.drawTenpaiSeats.map(turned);
  if (view.win) view.win.winner = turned(view.win.winner);
  view.messageParams = { ...view.messageParams };
  for (const key of ["playerSeat", "winner"]) view.messageParams[key] = turned(view.messageParams[key]);
  view.message = "";
  view.pendingAction = pendingViewFor(source.pendingAction, seat);
  return view;
}

// A guest only learns about an offer made to them. One made to someone else
// says that player can win on, or call, the tile just thrown — exactly what a
// real table keeps hidden.
function pendingViewFor(pending, seat) {
  if (pending?.type === "awaitingHumanRon" && pending.winner === seat) {
    return { type: pending.type, winner: 0, loser: rotateSeat(pending.loser, seat) };
  }
  if (pending?.type === "awaitingHumanCall" && pending.seat === seat) {
    return { type: pending.type, seat: 0, tile: pending.tile, fromSeat: rotateSeat(pending.fromSeat, seat) };
  }
  return null;
}

// Names are typed by other people and end up in every device's markup, so
// they are cut down to plain text of a sensible length on the way in, and
// escaped again on the way out wherever they meet HTML.
function cleanName(raw) {
  const name = String(raw ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 16);
  return name || null;
}

function myName() {
  return cleanName(els.lanName.value);
}

// Who this device is, across connections. A guest sends it when it joins; if
// its connection drops, coming back with the same token returns it to its
// chair. It is never shown to anyone else, so nobody can take a chair that is
// not theirs by quoting it.
let cachedDeviceToken = null;

function deviceToken() {
  if (cachedDeviceToken) return cachedDeviceToken;
  let token = cleanToken(getStoredPreference(DEVICE_STORAGE_KEY));
  if (!token) {
    const bytes = new Uint8Array(16);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
    else bytes.forEach((_, i) => { bytes[i] = Math.floor(Math.random() * 256); });
    token = [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
    setStoredPreference(DEVICE_STORAGE_KEY, token);
  }
  cachedDeviceToken = token;
  return token;
}

function cleanToken(raw) {
  return typeof raw === "string" && /^[A-Za-z0-9-]{8,64}$/.test(raw) ? raw : null;
}

function hostSeatInfo() {
  return { controller: "host", name: myName() };
}

function guestSeatInfo(clientId) {
  const member = lanConnection?.members.get(clientId) ?? {};
  return { controller: "guest", clientId, token: member.token ?? null, name: member.name ?? null };
}

// Seats the people connected so far in the order they arrived, with bots in
// any chair left over. Anyone past the third waits for a chair to come free.
function startSharedMatch() {
  if (lanConnection?.kind !== "host" || lanConnection.peers.size === 0) return;
  const arrived = [...lanConnection.peers];
  lanTable = {
    seats: [hostSeatInfo(), ...[0, 1, 2].map(i => arrived[i] ? guestSeatInfo(arrived[i]) : { controller: "bot" })],
    waiting: arrived.slice(3)
  };
  // The solo match is left in the save, untouched, for when the room closes.
  closeLanPanel();
  closeWelcome();
  startMatch();
}

// A chair someone left is held for them for the rest of the match, with a bot
// playing it. A new match frees those chairs for whoever is waiting.
function releaseReservedSeats() {
  if (!lanTable) return;
  lanTable.seats = lanTable.seats.map(seat => (seat.controller === "bot" ? { controller: "bot" } : seat));
}

// Called as each hand is dealt: people who connected while a match was on take
// a bot's chair, as long as it is not being kept for someone who left.
function seatWaitingGuests() {
  if (!lanTable) return;
  lanTable.waiting = lanTable.waiting.filter(id => lanConnection?.peers.has(id));
  for (let seat = 1; seat < 4 && lanTable.waiting.length > 0; seat += 1) {
    const chair = lanTable.seats[seat];
    if (chair.controller === "bot" && !chair.token) lanTable.seats[seat] = guestSeatInfo(lanTable.waiting.shift());
  }
}

function handleHello(clientId, message) {
  const member = { name: cleanName(message?.name), token: cleanToken(message?.token) };
  lanConnection.members.set(clientId, member);
  if (lanTable) {
    let seat = lanTable.seats.findIndex(chair => chair.controller === "guest" && chair.clientId === clientId);
    // Same device, new connection: a dropped player coming back, or a phone
    // whose Wi-Fi blinked before the host noticed the old connection die.
    if (seat < 0 && member.token) seat = lanTable.seats.findIndex((chair, i) => i > 0 && chair.token === member.token);
    if (seat >= 0) seatGuestAgain(seat, clientId, member);
    else if (!lanTable.waiting.includes(clientId)) lanTable.waiting.push(clientId);
  }
  broadcastLobby();
  updateLanPanel();
}

function seatGuestAgain(seat, clientId, member) {
  const returning = lanTable.seats[seat].clientId !== clientId;
  lanTable.seats[seat] = { controller: "guest", clientId, token: member.token, name: member.name };
  lanTable.waiting = lanTable.waiting.filter(id => id !== clientId);
  const player = state.players[seat];
  if (player) {
    player.controller = "guest";
    player.clientId = clientId;
    player.name = member.name;
    // The bot that was about to discard for them stands down: the chair owes
    // that discard to its person again. Its timer finds the chair no longer a
    // bot's and does nothing.
    if (state.pendingAction?.type === "awaitingBotTurn" && state.pendingAction.seat === seat) state.pendingAction = null;
  }
  if (returning) lanLog(t("lanRejoined", { name: member.name ?? t("lanGuestName", { n: seat + 1 }) }));
  render();
}

function handleGuestIntent(clientId, intent) {
  if (!lanTable) return;
  const seat = state.players.findIndex(p => p.controller === "guest" && p.clientId === clientId);
  if (seat >= 0) applyIntent(seat, intent);
}

// A guest who drops out leaves their chair to a bot, which plays on from
// exactly where they were. Whatever the table was waiting on from them is
// settled the way a bot would settle it. The chair stays theirs to come back to.
function handOverToBot(seat) {
  if (!lanTable) return;
  const left = lanTable.seats[seat];
  lanTable.seats[seat] = { controller: "bot", token: left.token ?? null, name: left.name ?? null };
  const player = state.players[seat];
  player.controller = "bot";
  player.clientId = null;
  player.name = NAMES[seat];
  const pending = state.pendingAction;
  if (!state.gameOver) {
    if (pending?.type === "awaitingHumanRon" && pending.winner === seat) {
      state.pendingAction = { type: "awaitingBotRon", winner: seat, loser: pending.loser };
      schedule(() => winHand(seat, pending.loser, "Ron"), 400);
    } else if (pending?.type === "awaitingHumanCall" && pending.seat === seat) {
      passOffer(seat);
    } else if (state.turn === seat && state.pendingDiscard) {
      state.pendingAction = { type: "awaitingBotTurn", seat };
      schedule(botDiscard, 550);
    }
  }
  render();
}

function endSharedMatch() {
  if (!lanTable) return;
  state.players.forEach((player, seat) => {
    if (player.controller === "guest") handOverToBot(seat);
  });
  lanTable = null;
  // From here the match is a solo one again, and is saved like one.
  render();
}

// Who sits where, as the lobby shows it. Before a match starts it is who would
// sit where if it started now. Connection ids stay on the host.
function lobbySeats() {
  const arrived = lanConnection?.kind === "host" ? [...lanConnection.peers] : [];
  const chairs = lanTable?.seats
    ?? [hostSeatInfo(), ...[0, 1, 2].map(i => arrived[i] ? guestSeatInfo(arrived[i]) : { controller: "bot" })];
  return chairs.map((chair, seat) => ({
    kind: chair.controller === "bot" ? (chair.token ? "away" : "bot") : chair.controller,
    name: chair.controller === "bot" && !chair.token ? NAMES[seat] : (chair.name ?? null),
    clientId: chair.clientId ?? null
  }));
}

function broadcastLobby() {
  if (lanConnection?.kind !== "host") return;
  const seats = lobbySeats();
  const waiting = lanTable ? lanTable.waiting : [...lanConnection.peers].slice(3);
  const shared = seats.map(({ clientId, ...visible }) => visible);
  for (const id of lanConnection.peers) {
    const message = {
      type: "lobby",
      started: lanTable !== null,
      you: seats.findIndex(chair => chair.clientId === id),
      waiting: waiting.length,
      seats: shared
    };
    Promise.resolve(lanConnection.room.send(id, message)).catch(() => {});
  }
  lanLobby = { started: lanTable !== null, you: 0, waiting: waiting.length, seats: shared };
  updateLanPanel();
}

// The lobby as this device last heard it: built locally on the host, sent by
// the host to each guest.
let lanLobby = null;

function onNameChanged() {
  const name = myName();
  els.lanName.value = name ?? "";
  setStoredPreference(NAME_STORAGE_KEY, name ?? "");
  if (lanConnection?.kind === "guest") sayHello();
  if (lanConnection?.kind === "host") {
    if (lanTable) {
      lanTable.seats[0].name = name;
      if (state.players[0]) state.players[0].name = name;
      render();
    }
    broadcastLobby();
  }
}

function sayHello() {
  lanConnection?.guest?.send({ type: "hello", name: myName(), token: deviceToken() });
}

function sendIntentToHost(intent) {
  if (lanConnection?.kind !== "guest") return;
  lanConnection.guest.send({ type: "intent", intent });
}

function applyView(message) {
  if (!message?.view || !Number.isInteger(message.seq)) return;
  if (guestTable && message.seq <= guestTable.lastSeq) return;
  if (!guestTable) enterGuestTable();
  guestTable.lastSeq = message.seq;
  const before = JSON.parse(JSON.stringify(state));
  Object.assign(state, message.view);
  if (!(state.turn === 0 && state.pendingDiscard)) selectedTileIndex = null;
  playViewSounds(before, state);
  updateFormatChip();
  render();
}

// The host plays its sounds as it moves the table; a guest has to work out
// from the change what just happened.
function playViewSounds(before, after) {
  if (!before.players?.length) return;
  if (after.win && !before.win) playSound("win");
  else if (after.discardCount === 0 && before.discardCount > 0) playSound("shuffle");
  else if (after.players.some((p, i) => p.riichi && !before.players[i]?.riichi)) playSound("riichi");
  else if (after.players.some((p, i) => p.melds.length > (before.players[i]?.melds.length ?? 0))) playSound("call");
  else if (after.discardCount > before.discardCount) playSound("discard");
}

function enterGuestTable() {
  guestTable = { lastSeq: 0 };
  // Whatever this device's own bots were about to do is cancelled: the table
  // they would have acted on is about to be replaced by the host's.
  tableEpoch += 1;
  selectedTileIndex = null;
  cancelTileDrag();
  resetZoom();
  closeLanPanel();
  closeWelcome();
  // Only the host can deal a new match at a shared table.
  els.newGameBtn.hidden = true;
  updateLanPanel();
}

// Back to the solo match this device was playing before it sat down, which the
// shared match never touched.
function leaveGuestTable() {
  if (!guestTable) return;
  guestTable = null;
  tableEpoch += 1;
  selectedTileIndex = null;
  els.newGameBtn.hidden = false;
  updateFormatChip();
  if (!tryResumeSavedGame()) startMatch();
  updateLanPanel();
}

function openLanPanel() {
  els.lanOverlay.hidden = false;
  els.lanHostBtn.hidden = !LanNet.canHost();
  updateLanPanel();
  els.closeLanBtn.focus();
}

function closeLanPanel() {
  els.lanOverlay.hidden = true;
}

function updateLanPanel() {
  const connected = lanConnection !== null;
  const hosting = lanConnection?.kind === "host";
  els.lanHostBtn.disabled = connected;
  els.lanJoinBtn.disabled = connected;
  els.lanAddress.disabled = connected;
  els.lanLeaveBtn.disabled = !connected;
  els.lanStartBtn.hidden = !hosting || lanTable !== null;
  els.lanStartBtn.disabled = !hosting || lanConnection.peers.size === 0;
  els.lanIntro.textContent = LanNet.canHost() ? t("lanIntro") : t("lanIntroGuestOnly");
  els.lanPeers.textContent = lobbySummary(hosting);
  renderLobbyList();
}

function lobbySummary(hosting) {
  if (!lanConnection || !lanLobby) return "";
  const waiting = lanLobby.waiting > 0 ? ` ${t("lanWaitingCount", { count: lanLobby.waiting })}` : "";
  if (hosting) {
    return (lanTable
      ? t("lanTableRunning", { count: lanLobby.seats.filter(s => s.kind === "guest").length })
      : t("lanPlayersConnected", { count: lanConnection.peers.size })) + waiting;
  }
  const hostName = lanLobby.seats[0]?.name;
  if (lanLobby.started && lanLobby.you < 0) return t("lanGuestWaitingHand");
  if (!lanLobby.started) return t("lanGuestWaitingStart", { host: hostName ?? t("lanTheHost") });
  return hostName ? t("lanGuestSeatedAt", { host: hostName }) : t("lanSeated");
}

// Four chairs, in turn order from the host's. Built as text, never markup:
// these names were typed on other people's phones.
function renderLobbyList() {
  els.lanSeats.replaceChildren();
  if (!lanConnection || !lanLobby) return;
  lanLobby.seats.forEach((chair, seat) => {
    const entry = document.createElement("li");
    entry.className = `lan-seat ${chair.kind}`;
    let label;
    if (chair.kind === "host") label = t("lanSeatHost", { name: chair.name ?? t("lanHostName") });
    else if (chair.kind === "guest") label = chair.name ?? t("lanGuestName", { n: seat + 1 });
    else if (chair.kind === "away") label = t("lanSeatAway", { name: chair.name ?? t("lanGuestName", { n: seat + 1 }) });
    else label = t(lanLobby.started ? "lanSeatBot" : "lanSeatOpen", { name: chair.name });
    if (seat === lanLobby.you) {
      label = t("lanSeatYou", { label });
      entry.classList.add("you");
    }
    entry.textContent = label;
    els.lanSeats.append(entry);
  });
}

function setLanStatus(key, params = {}) {
  els.lanStatus.textContent = t(key, params);
}

function lanLog(text) {
  const entry = document.createElement("li");
  entry.textContent = text;
  els.lanLog.prepend(entry);
  while (els.lanLog.children.length > 8) els.lanLog.lastChild.remove();
}

async function hostLanRoom() {
  try {
    setLanStatus("lanOpening");
    const peers = new Set();
    const members = new Map();
    const room = await LanNet.openRoom({
      onPeerJoined: id => {
        peers.add(id);
        lanLog(t("lanPeerJoined", { id }));
        broadcastLobby();
      },
      onPeerLeft: id => {
        peers.delete(id);
        const name = members.get(id)?.name;
        members.delete(id);
        if (lanTable) lanTable.waiting = lanTable.waiting.filter(waiting => waiting !== id);
        lanLog(t("lanPeerLeft", { id: name ?? id }));
        const seat = state.players.findIndex(p => p.controller === "guest" && p.clientId === id);
        if (seat >= 0) handOverToBot(seat);
        broadcastLobby();
      },
      onMessage: (id, message) => {
        if (message?.type === "intent") handleGuestIntent(id, message.intent);
        else if (message?.type === "hello") handleHello(id, message);
      },
      onError: error => lanLog(error.message)
    });
    lanConnection = { kind: "host", room, peers, members };
    setLanStatus("lanHosting", { address: room.address ?? "?", port: room.port });
    broadcastLobby();
  } catch (error) {
    setLanStatus("lanFailed", { reason: error.message });
  }
}

async function joinLanRoom() {
  try {
    setLanStatus("lanJoining");
    const guest = await LanNet.joinRoom({
      address: els.lanAddress.value,
      onMessage: message => {
        if (message?.type === "view") applyView(message);
        else if (message?.type === "lobby") {
          lanLobby = message;
          updateLanPanel();
        }
      },
      onClose: () => {
        // Hanging up on purpose clears lanConnection first, so reaching here
        // with it still set is the host going away rather than us leaving.
        if (!lanConnection) return;
        lanConnection = null;
        lanLobby = null;
        leaveGuestTable();
        setLanStatus("lanDisconnected");
        updateLanPanel();
      },
      onError: error => lanLog(error.message)
    });
    lanConnection = { kind: "guest", guest };
    sayHello();
    setLanStatus("lanJoined", { address: els.lanAddress.value.trim() });
    updateLanPanel();
  } catch (error) {
    setLanStatus("lanFailed", { reason: error.message });
  }
}

async function leaveLanRoom() {
  if (!lanConnection) return;
  const connection = lanConnection;
  // The host's guests are handed to bots before the room goes, so the match
  // plays on; a guest goes back to their own solo match.
  if (connection.kind === "host") endSharedMatch();
  lanConnection = null;
  lanLobby = null;
  if (connection.kind === "guest") leaveGuestTable();
  try {
    if (connection.kind === "host") await connection.room.close();
    else connection.guest.close();
  } catch {
    // Closing a connection that is already gone is not worth reporting.
  }
  setLanStatus("lanClosed");
  updateLanPanel();
}

function openYakuList() {
  els.yakuOverlay.hidden = false;
  els.closeYakuBtn.focus();
}

function closeYakuList() {
  els.yakuOverlay.hidden = true;
}

function renderYakuOverlay() {
  const copy = I18N[currentLanguage];
  const sections = YAKU_REFERENCE.map(section => {
    const rows = section.items.map(item => {
      const tags = [];
      if (section.section === "yakuman") {
        tags.push(`<span class="yaku-han">${copy.yakuManLabel}</span>`);
      } else if (item.han) {
        tags.push(`<span class="yaku-han">${t("yakuHan", { han: item.han })}</span>`);
        if (item.openHan) {
          tags.push(`<span class="yaku-tag">[${t("yakuOpenValue", { han: item.openHan })}]</span>`);
        }
      }
      if (item.closed) tags.push(`<span class="yaku-tag closed">${copy.yakuClosed}</span>`);
      const note = item.double ? ` <em>${copy[item.double]}</em>` : "";
      return `<li>
        <div class="yaku-head"><span class="yaku-name">${YAKU_NAMES[item.key][currentLanguage]}</span>${tags.join("")}</div>
        <p>${copy.yakuDesc[item.key]}${note}</p>
      </li>`;
    }).join("");
    return `<section><h3>${copy[section.section]}</h3><ul class="yaku-rows">${rows}</ul></section>`;
  }).join("");
  els.yakuOverlayContent.innerHTML = `<p class="intro-copy">${copy.yakuIntro}</p>${sections}`;
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

function saveGame() {
  // A finished match is not worth resuming, and render() runs after finishHand
  // clears the save, so bail out here rather than writing it straight back.
  if (state.matchOver) return;
  // Only a solo table is saved. A shared one cannot be resumed alone, and on a
  // guest the table is somebody else's, turned to face them: writing it would
  // overwrite the solo match they will want back when they leave.
  if (lanTable || isGuest()) return;
  try {
    const payload = { version: SAVE_SCHEMA_VERSION, savedAt: Date.now(), state };
    window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Browsers can block storage in private contexts; the game still works.
  }
}

function clearSavedGame() {
  try {
    window.localStorage.removeItem(SAVE_STORAGE_KEY);
  } catch {
    // Browsers can block storage in private contexts; the game still works.
  }
}

function tryResumeSavedGame() {
  let payload;
  try {
    const raw = window.localStorage.getItem(SAVE_STORAGE_KEY);
    if (!raw) return false;
    payload = JSON.parse(raw);
  } catch {
    clearSavedGame();
    return false;
  }
  const saved = payload?.state;
  const isValid = payload?.version === SAVE_SCHEMA_VERSION
    && saved
    && Array.isArray(saved.players)
    && saved.players.length === 4
    && !saved.matchOver;
  if (!isValid) {
    clearSavedGame();
    return false;
  }
  Object.assign(state, saved);
  upgradeLoadedState();
  render();
  resumePendingAction();
  return true;
}

// The setTimeout that would normally fire this is lost across a reload, so a
// resumed pendingAction is re-armed here instead of waiting on real wall-clock time.
// Offers to a person need nothing: render() reads them off the table.
function resumePendingAction() {
  const pending = state.pendingAction;
  if (!pending) return;
  switch (pending.type) {
    case "awaitingBotTurn":
      schedule(botDiscard, 300);
      break;
    case "awaitingBotRon":
      schedule(() => winHand(pending.winner, pending.loser, "Ron"), 300);
      break;
    case "awaitingNextTurn":
      schedule(nextTurn, 300);
      break;
    case "awaitingChankan":
      schedule(() => winHand(pending.winner, pending.loser ?? 0, "Ron", { isChankan: true }), 300);
      break;
  }
}

// Saves written before seats had owners still load. Everything missing is filled
// in as the solo table it was: you at seat 0, bots everywhere else.
function upgradeLoadedState() {
  state.players.forEach((player, seat) => {
    player.seat ??= seat;
    player.controller ??= seat === 0 ? "host" : "bot";
    player.clientId ??= null;
  });
  const pending = state.pendingAction;
  if (pending?.type === "awaitingHumanCall" && pending.seat === undefined) {
    pending.seat = 0;
    pending.queue = [];
  }
  if (pending?.type === "awaitingHumanRon") pending.passed ??= [];
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
  if (state.gameOver) {
    // Over the board, not in the action dock: the dock floats just above the
    // hand and is too small to host a full hand reveal.
    els.centerPanel.insertAdjacentHTML("beforeend", renderHandResult());
  }
  // The result card says what the status line would, so only one of them shows.
  els.statusText.hidden = state.gameOver;

  state.players.forEach((player, seat) => {
    const seatEl = els.seats[seat];
    seatEl.classList.toggle("turn", state.turn === seat && !state.gameOver);
    seatEl.innerHTML = `
      <div class="seat-header">
        <div>
          <div class="name">${windMarkHtml(player.wind)}${escapeHtml(playerLabel(seat))}</div>
          <div class="score">${formatPoints(player.score)} ${t("points")}</div>
        </div>
        <div class="badges">${player.riichi ? `<span class="badge">${t("riichi")}</span>` : ""}${seat === state.dealer ? `<span class="badge">${t("dealer")}</span>` : ""}${seat === 0 && isFuriten(player) ? `<span class="badge">${t("furiten")}</span>` : ""}${state.gameOver && !state.win && state.drawTenpaiSeats.includes(seat) ? `<span class="badge">${t("tenpaiBadge")}</span>` : ""}</div>
      </div>
      ${renderSeatBody(player, seat)}
    `;

    const riverEl = els.riverBlocks[seat];
    if (riverEl) {
      riverEl.setAttribute("aria-label", seat === 0 ? t("yourRiver") : t("riverOf", { player: playerLabel(seat) }));
      riverEl.innerHTML = renderRiver(player, seat);
    }
  });
  // Whatever just landed has now been shown landing. A new hand restarts the count.
  shownDiscardSeq = state.discardCount;

  renderActionBar();
  syncTable();
}

// The action bar is read off the table, never pushed from the middle of the
// game logic. That one rule is what lets the same table be drawn on the host,
// on a guest's phone from a view the host sent, and after a reload — without
// any of them having seen the moment the offer was made.
// Seat 0 is always whoever is looking: the host's own chair, or a guest's
// chair once their view has been turned to face them.
function renderActionBar() {
  showActions(viewerActions());
}

function viewerActions() {
  if (state.gameOver) {
    if (isGuest()) return [{ labelKey: "lanWaitingForHost", cls: "pass", disabled: true }];
    return [state.matchOver
      ? { labelKey: "newMatch", cls: "win", onClick: startMatch }
      : { labelKey: "nextHand", cls: "win", onClick: startHand }];
  }

  const pending = state.pendingAction;
  if (pending?.type === "awaitingHumanRon" && pending.winner === 0) {
    return [
      { labelKey: "ron", cls: "win", tiles: state.lastDiscard ? [state.lastDiscard] : [], onClick: () => act({ type: "ron" }) },
      { labelKey: "pass", cls: "pass", onClick: () => act({ type: "pass" }) }
    ];
  }
  if (pending?.type === "awaitingHumanCall" && pending.seat === 0) {
    const options = callOptions(0, pending.tile, pending.fromSeat);
    const actions = [];
    if (options.kan) {
      actions.push({ labelKey: "kan", labelParams: { tile: "" }, tiles: [pending.tile], onClick: () => act({ type: "minkan" }) });
    }
    if (options.pon) actions.push({ labelKey: "pon", tiles: [pending.tile], onClick: () => act({ type: "pon" }) });
    for (const option of options.chi) {
      actions.push({
        labelKey: "chi",
        labelParams: { tiles: "" },
        tiles: option,
        onClick: () => act({ type: "chi", option })
      });
    }
    actions.push({ labelKey: "pass", cls: "pass", onClick: () => act({ type: "pass" }) });
    return actions;
  }

  if (state.turn !== 0 || !state.pendingDiscard) return [];
  const actions = [];
  const me = state.players[0];
  if (!me.riichi && me.melds.length === 0 && me.score >= 1000 && state.wall.length >= 4
    && canDeclareRiichi(me.hand, me.melds.length)) {
    actions.push({ labelKey: "riichi", onClick: () => act({ type: "riichi" }) });
  }
  for (const tile of legalAnkanOptions(me)) {
    actions.push({ labelKey: "kan", labelParams: { tile: "" }, tiles: [tile], onClick: () => act({ type: "ankan", tile }) });
  }
  if (!me.riichi) {
    for (const tile of kakanOptions(me)) {
      actions.push({ labelKey: "kan", labelParams: { tile: "" }, tiles: [tile], onClick: () => act({ type: "kakan", tile }) });
    }
  }
  if (canWin(me.hand, me.melds.length) && checkWin(0, "Tsumo", me.drawnTile)) {
    actions.push({ labelKey: "tsumo", cls: "win", onClick: () => act({ type: "tsumo" }) });
  }
  return actions;
}

// Everything a player does goes through here. On the device holding the table
// it is applied at once to seat 0; on a guest's phone it is sent to the host,
// which applies it to the guest's real chair and sends the table back.
function act(intent) {
  if (isGuest()) {
    sendIntentToHost(intent);
    return;
  }
  applyIntent(0, intent);
}

// The host's single door for moves, its own and everyone else's. A guest's
// message is only a request: each case re-checks it against the table, and
// where the table already knows something — who discarded, which tile — that
// is what gets used, not what the message claimed.
function applyIntent(seat, intent) {
  if (!intent || typeof intent.type !== "string" || isBotSeat(seat)) return;
  const pending = state.pendingAction;
  const offeredRon = pending?.type === "awaitingHumanRon" && pending.winner === seat;
  const offeredCall = pending?.type === "awaitingHumanCall" && pending.seat === seat;
  const player = state.players[seat];

  switch (intent.type) {
    case "discard":
      discardTile(seat, Number(intent.tileIndex));
      break;
    case "riichi":
      declareRiichi(seat);
      break;
    case "ankan":
      declareAnkan(seat, intent.tile);
      break;
    case "kakan":
      declareKakan(seat, intent.tile);
      break;
    case "tsumo":
      if (state.turn === seat && state.pendingDiscard && !state.gameOver
        && canWin(player.hand, player.melds.length) && checkWin(seat, "Tsumo", player.drawnTile)) {
        winHand(seat, seat, "Tsumo");
      }
      break;
    case "ron":
      if (offeredRon) winHand(seat, pending.loser, "Ron");
      break;
    case "pon":
      if (offeredCall && callOptions(seat, pending.tile, pending.fromSeat).pon) {
        callPon(seat, pending.tile, pending.fromSeat);
      }
      break;
    case "minkan":
      if (offeredCall && callOptions(seat, pending.tile, pending.fromSeat).kan) {
        callMinkan(seat, pending.tile, pending.fromSeat);
      }
      break;
    case "chi": {
      if (!offeredCall || !Array.isArray(intent.option)) break;
      const wanted = intent.option.join(",");
      const option = callOptions(seat, pending.tile, pending.fromSeat).chi.find(o => o.join(",") === wanted);
      if (option) callChi(seat, pending.tile, option, pending.fromSeat);
      break;
    }
    case "pass":
      passOffer(seat);
      break;
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

  // Your calls sit to the right of your hand, the way they are laid out at a
  // real table, and only once there are some: an empty "Melds" box used to take
  // a quarter of the row the hand needs.
  if (seat === 0) {
    return `
      <div class="human-table">
        ${hand}
        ${melds ? `<div class="human-public" aria-label="${t("melds")}"><div class="melds">${melds}</div></div>` : ""}
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

// The table is redrawn far more often than anything happens on it, so an
// animation keyed to "this is the latest tile" would replay on every redraw.
// These remember what has already been shown arriving.
let shownDiscardSeq = 0;
let shownDrawKey = "";
let shownActionsKey = "";

function riverSlotHtml(entry, recent) {
  const classes = ["river-slot"];
  if (entry.riichi) classes.push("sideways");
  if (entry.tsumogiri) classes.push("tsumogiri");
  if (recent) classes.push("recent-slot");
  if (recent && entry.seq > shownDiscardSeq) classes.push("fresh");
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

// What happened, at the moment the hand ends — a win, a draw, or the last hand
// of the match. It replaces the status line for that moment rather than
// repeating it, and shows what each player gained or lost, which is the thing
// everyone at a table actually looks up to see.
function renderHandResult() {
  const evaluation = state.win?.evaluation;
  let heading;
  let detail = "";
  let body = "";

  if (state.win) {
    heading = `<div class="result-kind">${state.win.type}!</div>
      <div class="result-who">${escapeHtml(t("resultWinner", { player: playerLabel(state.win.winner) }))}</div>`;
    const handTiles = state.win.hand.map((tile, index) => {
      const isWinTile = state.win.tile && index === state.win.hand.lastIndexOf(state.win.tile);
      return tileHtml(tile, true, isWinTile);
    }).join("");
    const meldTiles = state.win.melds.map(meld => `<span class="result-meld">${meld.map(tile => tileHtml(tile, true)).join("")}</span>`).join("");
    body += `<div class="win-hand">${handTiles}${meldTiles ? `<span class="win-divider"></span>${meldTiles}` : ""}</div>`;
    if (evaluation) {
      const rows = evaluation.yakuList.map(y => `<li><span>${escapeHtml(yakuDisplayName(y))}</span><span class="result-han">${y.yakuman ? t("yakuManLabel") : t("yakuHan", { han: y.han })}</span></li>`).join("");
      body += `<ul class="win-yaku-list">${rows}</ul>`;
      detail = `<div class="win-score">
        <span class="result-points">${formatPoints(evaluation.points)}</span>
        <span class="result-unit">${t("points")}</span>
        ${evaluation.isYakuman ? "" : `<span class="result-hanfu">${evaluation.han} han · ${evaluation.fu} fu</span>`}
      </div>`;
    }
  } else {
    const tenpai = state.drawTenpaiSeats.map(seat => escapeHtml(playerLabel(seat)));
    heading = `<div class="result-kind draw">${t("resultDraw")}</div>
      <div class="result-who">${tenpai.length ? t("resultTenpai", { names: tenpai.join(", ") }) : t("resultNoTenpai")}</div>`;
  }

  // Read top to bottom the way it happened: the hand, what it scored, who paid,
  // and — if that was the last hand — where everyone finished.
  return `
    <div id="winReveal" class="win-reveal${state.matchOver ? " match-over" : ""}" aria-live="polite">
      ${heading}
      ${body}
      ${detail}
      ${renderScoreChanges()}
      ${state.matchOver ? renderStandings() : ""}
    </div>
  `;
}

// Each player's net for the hand, in seat order from your chair. Saves from
// before this was recorded have no starting score, and simply show nothing.
function renderScoreChanges() {
  if (state.players.some(p => typeof p.handStartScore !== "number")) return "";
  const cells = state.players.map((player, seat) => {
    const delta = player.score - player.handStartScore;
    const tone = delta > 0 ? "up" : delta < 0 ? "down" : "even";
    const sign = delta > 0 ? "+" : delta < 0 ? "−" : "±";
    return `<li class="delta ${tone}"><span class="delta-name">${escapeHtml(playerLabel(seat))}</span><span class="delta-value">${sign}${formatPoints(Math.abs(delta))}</span></li>`;
  }).join("");
  return `<ul class="result-deltas">${cells}</ul>`;
}

function renderStandings() {
  const order = state.players
    .map((player, seat) => ({ seat, score: player.score }))
    .sort((a, b) => b.score - a.score || a.seat - b.seat);
  const rows = order.map((entry, place) => `<li class="${place === 0 ? "first" : ""}">
      <span class="place">${place + 1}º</span>
      <span class="standing-name">${escapeHtml(playerLabel(entry.seat))}</span>
      <span class="standing-score">${formatPoints(entry.score)}</span>
    </li>`).join("");
  return `<div class="result-final">${t("resultMatchOver")}</div><ol class="result-standings">${rows}</ol>`;
}

// Points read the way the player's language writes numbers: 25.000 in
// Portuguese, 25,000 in English.
function formatPoints(value) {
  return Number(value).toLocaleString(currentLanguage === "pt" ? "pt-BR" : "en-US");
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
    ? tileButton(player.hand[drawnIndex], drawnIndex, freshDrawClass(player))
    : `<span class="draw-placeholder" aria-hidden="true"></span>`;
  setTimeout(bindHumanTiles, 0);
  return `
    <div class="hand-row">
      <div class="hand">${handButtons}</div>
      <div class="draw-slot">${drawSlot}</div>
    </div>
  `;
}

function freshDrawClass(player) {
  const key = `${state.round}:${state.honba}:${state.discardCount}:${player.drawnTile}`;
  if (key === shownDrawKey) return "drawn";
  shownDrawKey = key;
  return "drawn fresh";
}

function tileButton(tile, index, extraClass = "", forceDisabled = false) {
    const disabled = forceDisabled || state.turn !== 0 || !state.pendingDiscard || state.gameOver ? "disabled" : "";
    const title = t("discardTitle", { tile: tileName(tile) });
    // "locked" is the riichi hand that may not change: the one case where a
    // greyed tile says something. Otherwise a tile is merely not yours to play yet.
    const locked = forceDisabled ? "locked" : "";
    return `<button type="button" class="tile ${extraClass} ${locked} ${tileClass(tile)}" data-tile-index="${index}" ${disabled} title="${title}" aria-label="${title}">${tileImage(tile)}</button>`;
}

// Discarding is a deliberate act: pull the tile out of your hand and let go, or
// tap to raise it and tap again. A single stray tap can no longer throw a tile,
// which is what made small screens punishing.
const DRAG_THRESHOLD = 8;
let selectedTileIndex = null;
let tileDrag = null;

function bindHumanTiles() {
  document.querySelectorAll("[data-tile-index]").forEach(button => {
    if (Number(button.dataset.tileIndex) === selectedTileIndex) button.classList.add("selected");
    button.addEventListener("pointerdown", onTilePointerDown);
  });
}

function onTilePointerDown(event) {
  const button = event.currentTarget;
  if (button.disabled || event.button > 0) return;
  tileDrag = {
    index: Number(button.dataset.tileIndex),
    button,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
    ghost: null
  };
  // Listening on the document rather than the tile keeps the drag alive once the
  // finger leaves the tile, with or without pointer capture. Capture is only an
  // optimisation, and it throws if the pointer is already gone.
  document.addEventListener("pointermove", onTilePointerMove, { passive: false });
  document.addEventListener("pointerup", onTilePointerUp);
  document.addEventListener("pointercancel", cancelTileDrag);
  try {
    button.setPointerCapture?.(event.pointerId);
  } catch {
    // Dragging still works through the document listeners above.
  }
}

function onTilePointerMove(event) {
  if (!tileDrag || event.pointerId !== tileDrag.pointerId) return;
  const dx = event.clientX - tileDrag.startX;
  const dy = event.clientY - tileDrag.startY;
  if (!tileDrag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
  if (!tileDrag.moved) {
    tileDrag.moved = true;
    tileDrag.ghost = buildDragGhost(tileDrag.button);
    document.body.append(tileDrag.ghost);
    tileDrag.button.classList.add("dragging");
  }
  event.preventDefault();
  moveDragGhost(event.clientX, event.clientY);
}

function onTilePointerUp(event) {
  if (!tileDrag || event.pointerId !== tileDrag.pointerId) return;
  const drag = tileDrag;
  const releasedOutsideHand = !pointIsInHand(event.clientX, event.clientY);
  const wasDrag = drag.moved;
  const index = drag.index;
  const wasSelected = selectedTileIndex === index;
  cancelTileDrag();

  if (wasDrag) {
    // Dropped back over your own hand: you thought better of it.
    if (releasedOutsideHand) discard(index);
    return;
  }
  if (wasSelected) discard(index);
  else selectTile(index);
}

function discard(index) {
  selectedTileIndex = null;
  act({ type: "discard", tileIndex: index });
}

function selectTile(index) {
  selectedTileIndex = index;
  document.querySelectorAll("[data-tile-index]").forEach(button => {
    button.classList.toggle("selected", Number(button.dataset.tileIndex) === index);
  });
}

function cancelTileDrag() {
  if (!tileDrag) return;
  const { button, pointerId, ghost } = tileDrag;
  tileDrag = null;
  ghost?.remove();
  button.classList.remove("dragging");
  try {
    button.releasePointerCapture?.(pointerId);
  } catch {
    // Already released, which is the state we wanted anyway.
  }
  document.removeEventListener("pointermove", onTilePointerMove);
  document.removeEventListener("pointerup", onTilePointerUp);
  document.removeEventListener("pointercancel", cancelTileDrag);
}

// The ghost rides in screen coordinates, which saves undoing the rotation and
// scale the table is drawn under.
function buildDragGhost(button) {
  const rect = button.getBoundingClientRect();
  const ghost = button.cloneNode(true);
  ghost.removeAttribute("data-tile-index");
  ghost.disabled = true;
  ghost.className = `${button.className} tile-ghost`;
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  return ghost;
}

function moveDragGhost(x, y) {
  if (!tileDrag?.ghost) return;
  tileDrag.ghost.style.transform = `translate(${x}px, ${y}px) translate(-50%, -60%)`;
}

function pointIsInHand(x, y) {
  const hand = els.seats[0];
  if (!hand) return false;
  const rect = hand.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
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
// The table is laid out once at 1280x720 and then fitted to whatever screen it
// lands on. On top of that sits the view the player controls by pinching, which
// is kept separate so a resize never throws their zoom away.
const MAX_ZOOM = 3;
let baseStageTransform = "";
let zoom = 1;
let panX = 0;
let panY = 0;

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
  baseStageTransform = rotate
    ? `translate(${(vw + h) / 2}px, ${(vh - w) / 2}px) rotate(90deg) scale(${scale})`
    : `translate(${(vw - w) / 2}px, ${(vh - h) / 2}px) scale(${scale})`;
  applyStageTransform();
}

// Zooms about the middle of the screen, then pans. Written as a prefix to the
// fitted transform so the fitting maths above never has to know about zoom.
function applyStageTransform() {
  if (!els.stage) return;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  clampPan();
  els.stage.style.transform =
    `translate(${panX}px, ${panY}px) translate(${cx}px, ${cy}px) scale(${zoom}) translate(${-cx}px, ${-cy}px) ${baseStageTransform}`;
}

// Zooming in grows the table past the screen edges; this keeps the pan within
// the margin that growth created, so the table can never be dragged away.
function clampPan() {
  const limitX = (window.innerWidth * (zoom - 1)) / 2;
  const limitY = (window.innerHeight * (zoom - 1)) / 2;
  panX = Math.min(limitX, Math.max(-limitX, panX));
  panY = Math.min(limitY, Math.max(-limitY, panY));
}

function setZoom(next, focusX, focusY) {
  const clamped = Math.min(MAX_ZOOM, Math.max(1, next));
  if (clamped === zoom) return;
  // Keep whatever is under the pinch where it is, rather than letting the table
  // slide out from under the fingers.
  if (focusX !== undefined) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const ratio = clamped / zoom;
    panX = focusX - cx - (focusX - cx - panX) * ratio;
    panY = focusY - cy - (focusY - cy - panY) * ratio;
  }
  zoom = clamped;
  applyStageTransform();
}

function resetZoom() {
  zoom = 1;
  panX = 0;
  panY = 0;
  applyStageTransform();
}

// Two fingers work the view: pinch to zoom, slide to pan. One finger is left
// alone so it can still pick up and throw a tile.
function bindViewGestures() {
  const surface = document.querySelector(".stage-viewport");
  if (!surface) return;
  const points = new Map();
  let startSpread = 0;
  let startZoom = 1;
  let lastMidX = 0;
  let lastMidY = 0;

  const spread = () => {
    const [a, b] = [...points.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };
  const midpoint = () => {
    const [a, b] = [...points.values()];
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  };

  surface.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse") return;
    points.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (points.size === 2) {
      startSpread = spread();
      startZoom = zoom;
      const mid = midpoint();
      lastMidX = mid.x;
      lastMidY = mid.y;
      cancelTileDrag();
    }
  });

  surface.addEventListener("pointermove", event => {
    if (!points.has(event.pointerId)) return;
    points.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (points.size !== 2) return;
    event.preventDefault();
    const mid = midpoint();
    panX += mid.x - lastMidX;
    panY += mid.y - lastMidY;
    lastMidX = mid.x;
    lastMidY = mid.y;
    if (startSpread > 0) setZoom(startZoom * (spread() / startSpread), mid.x, mid.y);
    else applyStageTransform();
  }, { passive: false });

  // Releases are watched on the window, not the table. A finger that went down
  // on a tile bubbles its pointerdown up to here, but its pointerup is captured
  // by the drag and never reaches the table — and a pointer left behind in the
  // map puts the count past two, which quietly kills pinching from then on.
  const release = event => points.delete(event.pointerId);
  window.addEventListener("pointerup", release, true);
  window.addEventListener("pointercancel", release, true);

  // A way back to the whole table without pinching it down again.
  surface.addEventListener("dblclick", resetZoom);

  // Desktop still deserves a zoom, and ctrl+wheel is what a trackpad pinch sends.
  surface.addEventListener("wheel", event => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    setZoom(zoom * (event.deltaY < 0 ? 1.12 : 0.89), event.clientX, event.clientY);
  }, { passive: false });
}

window.addEventListener("resize", fitStage);
window.addEventListener("orientationchange", fitStage);
// A ResizeObserver on the root catches what plain resize events miss: browser
// zoom steps and a mobile URL bar sliding in and out.
if (typeof ResizeObserver === "function") {
  new ResizeObserver(fitStage).observe(document.documentElement);
}
window.visualViewport?.addEventListener("resize", fitStage);

els.lanName.value = cleanName(getStoredPreference(NAME_STORAGE_KEY)) ?? "";
selectFormat(selectedFormat);
applyLanguage();
fitStage();
bindViewGestures();
// Deal immediately so the setup screen opens over a live table rather than an
// empty one. Confirming the setup deals again with whatever format was picked.
// A saved in-progress match takes priority over both: resume it silently and
// skip the setup screen, so returning players land straight back on their hand.
if (!tryResumeSavedGame()) {
  startMatch();
  if (shouldShowWelcome()) {
    openWelcome(false);
  }
}
