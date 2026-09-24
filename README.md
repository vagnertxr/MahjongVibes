# Mahjong Vibes 🀄

Mahjong Vibes is a lightweight Riichi Mahjong game for the browser. It runs as plain HTML, CSS, and JavaScript, with a small Python server for local debugging and packaging scripts for desktop and Android.
Supports desktop and mobile.

**[Play Mahjong Vibes](https://vagnertxr.github.io/MahjongVibes/)** · **[Install on Android](https://github.com/vagnertxr/MahjongVibes/releases/latest)**

Run locally:

- **Easiest:** double-click `index.html` to open it in your browser.
- **Better experience (recommended):** run a tiny local server so the game can save data and work offline:
  ```sh
  python3 tools/server.py
  ```
  Then open the link it prints (usually `http://127.0.0.1:8000`).

## What You Get

- A full four-player table with smart local bots, so you can always start a game
- Standard Riichi flow: draw, discard, pon, chi, ron, tsumo, and riichi declarations
- Readable discard rivers arranged around the center of the table, six tiles per row and turned to face each player, the way a real table looks. Called tiles leave the river, the riichi declaration tile lies sideways, and drawn-and-discarded tiles are marked, so you can count and read what has been thrown
- A dead wall on the felt, drawn as its seven stacks. The face-up tile is a real dora indicator now, not the bonus itself: the dora is the next tile in order, wrapping 9 back to 1 and North back to East. Hover an indicator to see what it points at, and each kan flips another stack
- Seat winds shown as markers in front of each player, with the round wind picked out in gold
- Your hand rides the bottom edge of the table, with the calls floating just above it as chips, sized and ordered so the hand-ending ones sit out on the right and pass is the quietest thing on the row
- A center piece holding the round, the honba count, the tiles left in the wall, and the sticks on the table. The sticks are real: declaring riichi puts 1,000 points in the pot for the next winner to sweep, and each honba is worth 300 more on the hand that ends the streak
- Opponents' concealed hands stand in narrow columns at the edges, the way they look from across a table, which keeps the middle clear for the rivers. What you can see of them is what you could see across a real table: riichi and the dealer marker are public, but furiten is shown for your own seat alone
- A yaku list covering every yaku the table actually scores, with han values, the reduced value where opening a hand costs one, and which ones a closed hand alone can have. It opens over the board and closes again without disturbing the hand you are in
- A setup screen before the deal where you pick the match length, Tonpuusen or Hanchan, the way you pick a table before sitting at it. The choice is remembered, and it can never disturb a hand already in progress
- A match that waits for you. The table saves itself after every move, so closing the tab or the app and coming back drops you into the same hand, down to a call you were being offered
- Automatic scoring and score movement between players
- A fixed 1280x720 table scaled by a single transform, so the board looks the same on a desktop, a phone, and at any browser zoom level. A phone held upright turns the table sideways rather than squeezing it into a column

## Android

Download the `.apk` from the [latest release](https://github.com/vagnertxr/MahjongVibes/releases/latest) and open it on the phone. Android will ask you to allow installing apps from whatever you downloaded it with; that prompt is expected for an app that does not come from the Play Store.

The app is the same static game wrapped with Capacitor, and it is built by the `Android` workflow rather than by hand. Pushing a `v*` tag publishes the APK to a release; every push to `main` builds one as a workflow artifact.

To build it yourself you need Android Studio or the Android SDK:

```sh
npm install && npm run sync && cd android && ./gradlew assembleDebug
```

Playing a table across a local network — one phone hosting, up to three others joining — is planned but not built yet. See [docs/ANDROID_RELEASE.md](docs/ANDROID_RELEASE.md).

## Desktop App

Mahjong Vibes is prepared as a small PWA:

manifest.webmanifest describes the app shell.
sw.js caches the game files for offline replay after the first load.

PyInstaller scripts under `tools/build/` wrap the same files into desktop builds. See [docs/RELEASE.md](docs/RELEASE.md).

## License

MIT. See [LICENSE](LICENSE).
