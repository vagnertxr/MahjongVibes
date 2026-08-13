# Mahjong Vibes 🀄

Mahjong Vibes is a lightweight Riichi Mahjong game for the browser. It runs as plain HTML, CSS, and JavaScript, with a small Python server for local debugging and optional desktop packaging scripts.
Supports desktop and mobile.

**[Play Mahjong Vibes](https://vagnertxr.github.io/MahjongVibes/)**

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
- A center piece holding the round, the tiles left in the wall, the dora indicators, and the riichi sticks on the table. The sticks are real: declaring riichi puts 1,000 points in the pot, the pot rides across draws, and the next winner sweeps it
- Opponents' concealed hands stand in narrow columns at the edges, the way they look from across a table, which keeps the middle clear for the rivers
- Selectable Tonpuusen and Hanchan match lengths with end-of-match handling
- Automatic scoring and score movement between players
- A fixed 1280x720 table scaled by a single transform, so the board looks the same on a desktop, a phone, and at any browser zoom level. A phone held upright turns the table sideways rather than squeezing it into a column

## Desktop App

Mahjong Vibes is prepared as a small PWA:

manifest.webmanifest describes the app shell.
sw.js caches the game files for offline replay after the first load.

## License

MIT. See [LICENSE](LICENSE).
