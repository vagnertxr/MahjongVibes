// Immediate-execution code: preferences, listeners and bootstrap.
// Must load LAST: function declarations only hoist within their own script, so
// anything that runs at load time needs every other file already evaluated.

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
