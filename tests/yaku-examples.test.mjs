// Every example hand in the yaku list is scored by the game's own evaluator,
// and must be awarded the yaku it illustrates. A picture of a hand that the
// table would score differently teaches the wrong rule.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { device, wait } from "./support/table.mjs";

let table;
before(async () => {
  table = device("yaku-examples");
  await wait(150);
  // A dealt table supplies the round, the seat winds and a live wall; the
  // example hands replace seat 0's tiles.
  table.run("closeWelcome(); startMatch();");
});
after(() => table.close());

// Lays an example on seat 0 and asks the evaluator what it scores. Called
// groups become melds; the rest is the concealed hand. The opening-turn yaku
// (tenhou, chiihou) are ruled out by a discard already on the table, since a
// yakuman would otherwise hide every ordinary yaku the hand also has.
const SCORE_EXAMPLES = `(() => YAKU_REFERENCE.flatMap(section => section.items)
  .filter(item => item.example?.groups)
  .map(item => {
    const example = item.example;
    const open = new Set(example.open ?? []);
    const melds = example.groups
      .filter((_, i) => open.has(i))
      .map(group => ({
        type: group.length === 4 ? "minkan" : group[0] === group[1] ? "pon" : "chi",
        tiles: [...group],
        from: 3
      }));
    const concealed = example.groups.filter((_, i) => !open.has(i)).flat();
    const by = example.win?.by ?? "Tsumo";
    const winTile = example.win?.tile ?? concealed[concealed.length - 1];
    const hand = [...concealed];
    if (by === "Ron") hand.splice(hand.lastIndexOf(winTile), 1);
    const counts = {};
    example.groups.flat().forEach(tile => { counts[tile] = (counts[tile] ?? 0) + 1; });

    const player = state.players[0];
    Object.assign(player, {
      hand: hand.sort(compareTiles), melds, riichi: false, doubleRiichi: false, ippatsu: false,
      drawnTile: by === "Tsumo" ? winTile : null
    });
    state.players[1].discards = [{ tile: "Wh", seq: 1, tsumogiri: false, riichi: false, calledBy: null, callType: null }];
    state.callHappenedThisHand = melds.length > 0;
    const evaluation = checkWin(0, by, winTile);
    return {
      key: item.key,
      tooManyOfATile: Object.entries(counts).filter(([, n]) => n > 4).map(([tile]) => tile),
      awarded: evaluation ? evaluation.yakuList.map(y => y.key) : null
    };
  }))()`;

// Keys that the reference groups under one name.
const ACCEPTS = {
  yakuhai: key => key.startsWith("yakuhai"),
  chuurenPoutou: key => key.startsWith("chuurenPoutou"),
  kokushi: key => key.startsWith("kokushi")
};

test("every example hand is scored as the yaku it illustrates", () => {
  const results = JSON.parse(JSON.stringify(table.run(SCORE_EXAMPLES)));
  assert.ok(results.length >= 25, `expected the shape yaku and yakuman to have examples, got ${results.length}`);
  const wrong = results.filter(r => {
    const matches = ACCEPTS[r.key] ?? (key => key === r.key);
    return r.tooManyOfATile.length > 0 || !r.awarded || !r.awarded.some(matches);
  });
  assert.deepEqual(wrong, [], "these examples are not what they claim to be");
});

test("the dora example points at the next tile in order", () => {
  const dora = table.run(`doraFromIndicator(YAKU_REFERENCE.flatMap(s => s.items).find(i => i.key === "dora").example.indicator)`);
  assert.equal(dora, "5p");
});

test("the yaku list draws every example", () => {
  table.run("openYakuList()");
  const drawn = table.run("document.querySelectorAll('#yakuOverlayContent .yaku-example').length");
  const expected = table.run("YAKU_REFERENCE.flatMap(s => s.items).filter(i => i.example).length");
  assert.equal(drawn, expected);
  table.run("closeYakuList()");
});
