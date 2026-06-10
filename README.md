# Mahjong Vibes 🀄

Mahjong Vibes is a lightweight Riichi Mahjong game for the browser. It runs as plain HTML, CSS, and JavaScript, with a small Python server for local debugging and optional desktop packaging scripts.

The current game includes a four-player table, local bot turns, draw/discard flow, pon, chi, ron, tsumo, riichi, dora display, scoring movement, responsive layout, and PWA metadata for installable/offline-friendly browser use.

## Run Locally

Use Python 3.10 or newer.

```sh
python3 server.py
```

Then open the URL printed by the server, usually:

```text
http://127.0.0.1:8000
```

To use a different port:

```sh
python3 server.py --port 8080
```

To only serve this computer:

```sh
python3 server.py --host 127.0.0.1
```

You can also open `index.html` directly in a browser. The Python server is better for testing installability, service workers, mobile devices on the same Wi-Fi, and browser caching behavior.

## Installable Web App

Mahjong Vibes is prepared as a small PWA:

- `manifest.webmanifest` describes the app shell.
- `assets/icon.svg` provides the app icon.
- `sw.js` caches the game files for offline replay after the first load.

For public hosting, any static host works: GitHub Pages, Netlify, Cloudflare Pages, Vercel static output, or a simple web server. Serve the project root over HTTPS so browser install prompts and service workers work reliably.

## GitHub Pages

Yes, Mahjong Vibes can run on GitHub Pages because the playable game is static HTML, CSS, JavaScript, and assets.

To publish it:

1. Push the repo to GitHub.
2. Open the repo settings.
3. Go to Pages.
4. Set the source to the main branch and the project root.
5. Save, then open the GitHub Pages URL after it finishes deploying.

GitHub Pages serves over HTTPS, so the PWA manifest and service worker can work there.

## Desktop Builds

Linux build:

```sh
sh build-linux.sh
```

Run the Linux build with:

```sh
dist/linux/Mahjong\ Vibes
```

Windows build from Windows PowerShell:

```powershell
.\build-windows.ps1
```

Then double-click:

```text
dist\windows\Mahjong Vibes.exe
```

Windows folder build from Linux with Zig:

```sh
sh build-windows-wine.sh
```

This creates a Windows app folder at `dist/windows/`. Double-click `dist/windows/Mahjong Vibes.exe` on Windows to open the game in the default browser without typing a terminal command.

Generated output goes under `dist/`, which is ignored by Git.

## Release Checklist

Before publishing a release:

1. Run `python3 server.py` and play at least one full hand.
2. Check desktop and mobile widths in the browser.
3. Confirm the browser console has no errors.
4. Build the target package under `dist/`.
5. Launch the packaged app and confirm `index.html`, `styles.css`, `game.js`, `manifest.webmanifest`, `sw.js`, and `assets/icon.svg` are present.
6. Tag the release and upload only the final distributable files, not `build/`, virtual environments, or local agent files.

## Project Layout

```text
index.html              Browser entry point
styles.css              Responsive table and tile styling
game.js                 Game state, rules, bots, and rendering
server.py               Local debug web server
launcher.py             PyInstaller launcher for desktop builds
manifest.webmanifest    Installable web app metadata
sw.js                   Offline cache service worker
assets/icon.svg         App icon
```

## License

MIT. See [LICENSE](LICENSE).
