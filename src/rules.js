// Pure rule engine: reads no state and touches no DOM, so it is safe to run
// anywhere, including against a redacted view.

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

function compareTiles(a, b) {
  return TILE_ORDER.indexOf(a) - TILE_ORDER.indexOf(b);
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

// Lives here rather than with the renderers because the I18N rules pages call it
// while their object literal is still being evaluated, so it has to exist before
// i18n-data.js runs. It builds a string and touches no DOM, so rules.js fits.
function guideTiles(tiles) {
  return tiles.map(tile => `<span class="tile small ${tileClass(tile)}">${tileImage(tile)}</span>`).join("");
}
