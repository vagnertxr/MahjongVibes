# Android Release Plan: LAN Multiplayer

This is the plan for shipping Mahjong Vibes as an installable Android `.apk`
playable over a local network: one player creates the table, up to three others
join from their own phones. It is a roadmap, not a record of work done — nothing
in this document is implemented yet.

The companion document [RELEASE.md](RELEASE.md) covers the shipping web, PWA and
desktop envelopes, all of which stay as they are. The Android app is another
envelope around the same static files, not a fork of them.

## Where the Project Starts From

Worth stating plainly, because it shapes every phase below:

- There is **no networking code of any kind**. No WebSocket, no WebRTC, no
  fetch to another host. `tools/server.py` binds `0.0.0.0` and prints the LAN
  address, but it only serves static files — it is a debug convenience, not a
  backend, and it is not what will carry multiplayer traffic.
- There is **no Node or Android project**. No `package.json`, no Gradle, no
  `AndroidManifest.xml`. Android packaging starts from nothing.
- **Seat 0 is the human, structurally.** `state.players[0]` and `seat === 0`
  are hardcoded in roughly a dozen places. There is no per-seat role flag. Real
  multiplayer cannot happen until that assumption is replaced.
- The bot AI (`chooseBotDiscard`, `tileValue`) is small and cleanly isolated,
  which makes it easy to keep as the fallback for unclaimed or dropped seats.
- Only one icon exists, `assets/icon.svg`. Android needs a generated PNG set.

## Decisions Already Made

| Question | Decision |
| --- | --- |
| Finding the host | Manual IP entry, not mDNS auto-discovery |
| Seats nobody claims | Bots keep playing them |
| Building the APK | GitHub Actions CI, debug-signed |

These are settled and the phases below assume them.

## Phase 1 — Package the Game as an APK

Prove the packaging path works while the game is still exactly what it is today:
single device, three bots, no networking. Nothing here should change gameplay.

- Add a `package.json` (the repo's first) with Capacitor: `@capacitor/core`,
  `@capacitor/cli`, `@capacitor/android`. Capacitor is the right wrapper because
  it takes an existing static web app as-is. There is no bundler or framework
  here and none needs to be introduced.
- Add a small `npm run build` that copies `index.html`, `game.js`, `styles.css`,
  `manifest.webmanifest`, `sw.js` and `assets/` into a generated `www/`. The
  source files stay where they are, so the web, PWA and PyInstaller envelopes
  keep working untouched. `www/` is generated output and belongs in
  `.gitignore` alongside `/dist/` and `/build/`.
- `npx cap add android` scaffolds the Gradle project into `android/`. Per
  Capacitor convention that directory is committed.
- Generate the Android icon set from `assets/icon.svg`.
- Confirm the service worker behaves inside the WebView. Registration is already
  guarded against `file:` in `index.html`, and Capacitor serves over its own
  scheme, so it should register — but verify that its cache does not fight
  local iteration.

**Done when:** a debug APK installs on a phone and plays the current bot game.

## Phase 2 — A Local Server on the Host Device

The networking primitive, proven on its own before any game logic depends on it.

Joining is the easy half: `new WebSocket('ws://<host-ip>:<port>')` works from
ordinary JavaScript inside the WebView. No plugin, no permission beyond the
`INTERNET` that Capacitor already declares.

Hosting is the half that needs native code. A WebView cannot listen for incoming
connections, so the host needs a small Capacitor plugin in Kotlin wrapping an
embedded WebSocket server. **NanoHTTPD's NanoWSD** is the right size for this:
one small dependency that accepts a handful of LAN connections and relays text
frames, with none of the service-discovery or TLS weight of a full server
framework.

The plugin exposes to JavaScript:

- `startServer(port)`, `stopServer()`
- `send(clientId, message)`, `broadcast(message)`
- events: `clientConnected`, `clientDisconnected`, `message`

It also needs `ACCESS_WIFI_STATE` so the host can display its own LAN address.

**Done when:** one phone taps "Create Room" and shows its IP, a second phone
connects to it, and a test message makes the round trip. No game logic yet.

## Phase 3 — Give Every Seat an Owner

The structural refactor. This is the largest and riskiest phase and deserves its
own detailed plan when it is reached; the shape is:

- **A role per seat.** Add `player.controller` — `"local-human"`,
  `"remote-human"` or `"bot"` — populated in `startHand()`. Single-device play
  sets seat 0 local and the rest bots, which is exactly today's behavior.
- **Replace the hardcoded seat 0.** Every `seat === 0` and
  `const human = state.players[0]` becomes a role check against "which seat does
  this device own" (`isMySeat(seat)`).
- **Render from the viewer's chair.** A player sitting in seat 2 should see
  themselves at the bottom of the table. Introduce a `visualSeat(seat)` mapping
  used only at render time, and leave all game logic — turn order, dealer math,
  `findRon` — indexed by absolute seat. That keeps the blast radius small.
- **Redact what goes over the wire.** The host holds the authoritative `state`.
  Today opponents' hands are hidden by not drawing them, which is a rendering
  decision; once hands are serialized and sent, concealment has to move into the
  data. Add `buildRedactedStateFor(seat)` that blanks every hand but the
  recipient's, and broadcast a per-client view.
- **Clients send intent, not mutations.** A remote player's button handler sends
  `{type: "discard", tileIndex}` rather than calling `discardTile` locally. The
  host validates it, applies it through the existing game functions, and
  broadcasts the result. The game logic itself barely changes; its call sites do.

This phase also makes save/resume and multiplayer coexist sensibly — the
`pendingAction` record added for the save already names what the table is
waiting on, which is the same question the network protocol has to answer.

## Phase 4 — Creating and Joining a Table

- **Host:** "Create Room" starts the Phase 2 server and displays the device's
  LAN address plus a short room code. The code is a visual confirmation for the
  people typing the address in, not a matchmaking identifier — there is no
  discovery service for it to resolve against.
- **Guest:** "Join Room" takes an address, connects, and receives a seat and an
  initial redacted state from the host.
- **Lobby:** the host sees all four seats and who holds each one. Because bots
  fill unclaimed seats, the host can start whenever they want; waiting for three
  humans is never required.
- **Disconnects:** a dropped player's seat reverts to bot control and play
  continues. The joining device holds a rejoin token so it can reclaim its seat
  for the rest of the match if it comes back.

## Phase 5 — Building and Shipping It

The development machine has Node but no JDK or Android SDK, and provisioning
that toolchain is heavy enough that it should not be a prerequisite for working
on the game. So the APK is built in CI.

Add `.github/workflows/android-release.yml` — the repo's first CI workflow —
triggered on a release tag. It provisions Temurin JDK 17 and the Android SDK,
runs `npm ci && npm run build && npx cap sync android`, then
`./gradlew assembleDebug`, and attaches the APK to the GitHub release. This
mirrors what `tools/build/build-linux.sh` and `build-windows.ps1` already do for
the desktop artifacts, just hosted rather than local.

Debug signing is sufficient for installing on your own and your friends' phones.
Commit a fixed debug keystore so CI produces a consistent signature across
builds — a debug key carries no trust and is safe to version. A real release
keystore would only be needed for wider distribution, and if that day comes it
belongs in GitHub Actions secrets, never in the repo.

Keep the local path documented too, for anyone who does have Android Studio:
`npm install`, `npm run build`, `npx cap sync android`, then build from the IDE
or `./gradlew assembleDebug`.

Finally, extend [RELEASE.md](RELEASE.md) — both its artifact list and its
enveloping options — to name the Android build and point here.

## Sequencing

Phase 1 depends on nothing. Phases 2 and 3 are independent of each other and can
run in parallel; Phase 4 needs both. Phase 5 is worth standing up right after
Phase 1 rather than last, so every later phase has a real APK to test on a real
phone instead of accumulating months of unverified work.

## Assumptions Worth Revisiting

These were resolved toward the simplest option rather than asked about. Any of
them can be reopened before Phase 2 starts, but each would change scope:

- **Sideload only, no Play Store.** This is what makes debug signing adequate.
  Store distribution would require a release keystore, a privacy policy, content
  rating and review.
- **The `android/` project is committed.** Capacitor's convention, but it is a
  large generated tree in a repo that has so far stayed very small.
- **The room code is decorative.** It confirms people typed the right address;
  it does not route anything.
- **The host plays too.** The hosting device occupies a seat rather than acting
  as a dedicated referee.
