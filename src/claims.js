// The claim window: what happens between a discard and the next draw.
//
// With one human this was decided inline -- findRon picked the first seat
// clockwise and only seat 0 was ever offered a call. With four people, up to
// three seats can want the same tile at once, so the discard opens a window,
// every eligible seat is asked in private what it wants, and the host resolves
// them together by priority. Nothing advances until the window closes.

// Ron outranks a pon or a kan, which outrank a chi. Ranked so the resolver can
// just take the highest.
const CLAIM_RANK = { ron: 3, minkan: 2, pon: 2, chi: 1 };

// Each decision gets a base allowance plus a small bonus that is granted per
// turn and does not accumulate, so the longest anyone can hold the table is
// base + cap.
const CLAIM_BASE_MS = 20000;
const CLAIM_BONUS_PER_TURN_MS = 5000;
const CLAIM_BONUS_CAP_MS = 5000;

// How long the table waits after an uncontested discard, purely for pacing.
const NEXT_TURN_DELAY_MS = 450;

let claimTimer = null;

function claimBudgetMs(seat) {
  const player = state.players[seat];
  if (!player) return CLAIM_BASE_MS;
  return CLAIM_BASE_MS + Math.min(CLAIM_BONUS_CAP_MS, player.timeBank ?? 0);
}

// Called when a seat is about to be asked for a decision: tops the bonus up by
// one turn's worth, clamped, so it never builds into a long stall.
function grantTurnBonus(seat) {
  const player = state.players[seat];
  if (!player) return;
  player.timeBank = Math.min(CLAIM_BONUS_CAP_MS, (player.timeBank ?? 0) + CLAIM_BONUS_PER_TURN_MS);
}

// Everything `seat` could legally do with `tile` just discarded by `fromSeat`.
// Pure: it reads state but changes nothing, so it is also what tells a bot what
// its choices are.
function claimOptionsFor(seat, tile, fromSeat) {
  if (seat === fromSeat) return [];
  const player = state.players[seat];
  const options = [];

  const canRon = canWin([...player.hand, tile], player.melds.length)
    && !isFuriten(player)
    && !!checkWin(seat, "Ron", tile);
  if (canRon) options.push({ type: "ron" });

  // A riichi hand is locked: it may win, but it may not call.
  if (!player.riichi) {
    const same = player.hand.filter(t => t === tile).length;
    if (same >= 3) options.push({ type: "minkan", tile });
    if (same >= 2) options.push({ type: "pon", tile });
    if (fromSeat === seatToMyLeft(seat)) {
      chiOptions(player.hand, tile).forEach((option, index) => {
        options.push({ type: "chi", tile, option, optionIndex: index });
      });
    }
  }
  return options;
}

function openClaimWindow(tile, fromSeat) {
  const eligible = [];
  const options = {};
  for (let offset = 1; offset < 4; offset += 1) {
    const seat = (fromSeat + offset) % 4;
    const seatOptions = claimOptionsFor(seat, tile, fromSeat);
    if (seatOptions.length) {
      eligible.push(seat);
      options[seat] = seatOptions;
    }
  }

  if (!eligible.length) {
    state.claim = null;
    setTimeout(nextTurn, NEXT_TURN_DELAY_MS);
    return;
  }

  eligible.forEach(grantTurnBonus);
  const deadlineMs = Math.max(...eligible.map(claimBudgetMs));
  const claim = {
    id: `${state.discardCount}:${tile}:${fromSeat}`,
    tile,
    fromSeat,
    eligible,
    options,
    responses: {},
    // Wall-clock so a reconnecting client can still draw the right countdown.
    opensAt: Date.now(),
    closesAt: Date.now() + deadlineMs
  };
  state.claim = claim;

  // Bots answer synchronously, so take every bot answer before resolving
  // anything: resolving inside the loop would clear state.claim underneath the
  // seats that had not been asked yet.
  eligible.forEach(seat => {
    if (isBotSeat(seat)) claim.responses[seat] = botChooseClaim(seat, options[seat]);
  });

  if (eligible.every(seat => seat in claim.responses)) {
    resolveClaims("answered");
    return;
  }

  // A human still owes an answer, so arm the deadline: silence is a pass.
  clearTimeout(claimTimer);
  claimTimer = setTimeout(() => resolveClaims("deadline"), deadlineMs);

  if (eligible.includes(localSeat) && !(localSeat in claim.responses)) {
    showClaimActions(localSeat);
  }
  render();
}

function showClaimActions(seat) {
  const claim = state.claim;
  const actions = claim.options[seat].map(option => {
    if (option.type === "ron") {
      return { labelKey: "ron", cls: "win", onClick: () => submitClaim(seat, option) };
    }
    if (option.type === "minkan") {
      return { labelKey: "kan", labelParams: { tile: tileText(option.tile) }, onClick: () => submitClaim(seat, option) };
    }
    if (option.type === "pon") {
      return { labelKey: "pon", onClick: () => submitClaim(seat, option) };
    }
    return {
      labelKey: "chi",
      labelParams: { tiles: option.option.map(tileText).join("") },
      onClick: () => submitClaim(seat, option)
    };
  });
  actions.push({ labelKey: "pass", cls: "pass", onClick: () => submitClaim(seat, null) });
  showActions(actions);
}

// A seat's answer. null means pass. Late or duplicate answers are ignored, which
// is what keeps a slow network from reopening a resolved window.
function submitClaim(seat, choice) {
  const claim = state.claim;
  if (!claim || !claim.eligible.includes(seat) || seat in claim.responses) return;
  claim.responses[seat] = choice ?? null;
  if (seat === localSeat) clearActions();
  if (claim.eligible.every(s => s in claim.responses)) resolveClaims("answered");
}

function resolveClaims(reason) {
  const claim = state.claim;
  if (!claim) return;
  clearTimeout(claimTimer);
  state.claim = null;
  clearActions();

  const { tile, fromSeat } = claim;
  // Turn order from the discarder is also the tie-break order: the nearest seat
  // wins a shared ron (atamahane) and a shared pon/chi alike.
  const contenders = [1, 2, 3]
    .map(offset => (fromSeat + offset) % 4)
    .filter(seat => claim.responses[seat])
    .map(seat => ({ seat, choice: claim.responses[seat] }));

  if (!contenders.length) {
    setTimeout(nextTurn, reason === "deadline" ? 0 : NEXT_TURN_DELAY_MS);
    return;
  }

  let best = contenders[0];
  for (const entry of contenders) {
    if (CLAIM_RANK[entry.choice.type] > CLAIM_RANK[best.choice.type]) best = entry;
  }

  const { seat, choice } = best;
  if (choice.type === "ron") {
    winHand(seat, fromSeat, "Ron");
    return;
  }
  if (choice.type === "pon") return callPon(seat, tile, fromSeat);
  if (choice.type === "minkan") return callMinkan(seat, tile, fromSeat);
  if (choice.type === "chi") return callChi(seat, tile, choice.option, fromSeat);
}

function cancelClaimWindow() {
  clearTimeout(claimTimer);
  state.claim = null;
}

// The countdown only ever describes the window this device has to answer. It is
// driven off closesAt rather than a decrementing counter so a lagging frame or a
// backgrounded tab cannot drift it away from the host's deadline.
let claimTickTimer = null;

function updateClaimTimer() {
  const el = els.claimTimer;
  if (!el) return;
  const claim = state.claim;
  const mine = claim && claim.eligible.includes(localSeat) && !(localSeat in claim.responses);
  if (!mine) {
    el.hidden = true;
    clearInterval(claimTickTimer);
    claimTickTimer = null;
    return;
  }
  el.hidden = false;
  const total = claim.closesAt - claim.opensAt;
  const paint = () => {
    const left = Math.max(0, claim.closesAt - Date.now());
    el.querySelector(".claim-bar").style.setProperty("--claim-left", `${(left / total) * 100}%`);
    el.querySelector(".claim-secs").textContent = Math.ceil(left / 1000);
    el.classList.toggle("urgent", left <= 5000);
    if (left <= 0) { clearInterval(claimTickTimer); claimTickTimer = null; }
  };
  paint();
  clearInterval(claimTickTimer);
  claimTickTimer = setInterval(paint, 200);
}
