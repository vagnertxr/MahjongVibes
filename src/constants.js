// Tile tables, wind and honor names, storage keys, the sound map and match formats.

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
