# Public Release Notes

This repo is now shaped for public release as a dependency-light browser game:

- Source runs directly in the browser with no build step.
- `tools/server.py` provides a local HTTP server for debugging, phone testing, and service worker checks.
- PWA files make the app installable when hosted over HTTPS.
- PyInstaller and Windows folder scripts can wrap the same static app into desktop-style builds.
- Generated artifacts stay out of Git through `.gitignore`.

## Recommended Release Artifacts

For a GitHub release, upload one or more of:

- A zip of the source files for web/static hosting.
- `dist/linux/` from `sh tools/build/build-linux.sh`.
- `dist/windows/` from `sh tools/build/build-windows-wine.sh`.
- `dist/windows/Mahjong Vibes.exe` from `tools/build/build-windows.ps1`.
- An Android `.apk`, built by the `Android` workflow when a `v*` tag is pushed. See [ANDROID_RELEASE.md](ANDROID_RELEASE.md).

Do not upload local virtual environments, `build/`, Python caches, `.agents/`, `.codex/`, or `AGENTS.md`.

## Enveloping Options

Mahjong Vibes is easy to wrap because the playable core is static:

- Web envelope: host the project root as a static site.
- PWA envelope: install from a browser after serving over HTTPS.
- Python envelope: run `tools/server.py` for local debug and LAN testing.
- PyInstaller envelope: package `tools/desktop/launcher.py` with the static assets.
- Native shell envelope: use a thin platform launcher that opens `index.html` beside the executable.
- Android envelope: `npm run sync` copies the same static files into the Capacitor project in `android/` for an installable `.apk`. Sharing the table over a local network is still planned; see [ANDROID_RELEASE.md](ANDROID_RELEASE.md).

Keep all wrappers pointed at the same static files so gameplay fixes do not need to be duplicated.
