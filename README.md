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
- Selectable Tonpuusen and Hanchan match lengths with end-of-match handling
- Live dora indicator display
- Automatic scoring and score movement between players
- A responsive layout that works on phones, tablets, and desktops

## Desktop App

Mahjong Vibes is prepared as a small PWA:

manifest.webmanifest describes the app shell.
sw.js caches the game files for offline replay after the first load.

## License

MIT. See [LICENSE](LICENSE).
