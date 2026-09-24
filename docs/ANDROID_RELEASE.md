# Android Release Plan: LAN Multiplayer

This is the plan for shipping Mahjong Vibes as an installable Android `.apk`
playable over a local network: one player creates the table, up to three others
join from their own phones.

**Phase 1 and Phase 5 have landed** — the app packages and builds today, against
bots, on one device. Phases 2 through 4, which are the networking, are still
ahead.

The companion document [RELEASE.md](RELEASE.md) covers the shipping web, PWA and
desktop envelopes, all of which stay as they are. The Android app is another
envelope around the same static files, not a fork of them.

## What the Networking Work Still Faces

Worth stating plainly, because it shapes the phases that are left:

- There is **no networking code of any kind**. No WebSocket, no WebRTC, no
  fetch to another host. `tools/server.py` binds `0.0.0.0` and prints the LAN
  address, but it only serves static files — it is a debug convenience, not a
  backend, and it is not what will carry multiplayer traffic.
- **Seat 0 is the human, structurally.** `state.players[0]` and `seat === 0`
  are hardcoded in roughly a dozen places. There is no per-seat role flag. Real
  multiplayer cannot happen until that assumption is replaced.
- The bot AI (`chooseBotDiscard`, `tileValue`) is small and cleanly isolated,
  which makes it easy to keep as the fallback for unclaimed or dropped seats.

## Decisions Already Made

| Question | Decision |
| --- | --- |
| Finding the host | Manual IP entry, not mDNS auto-discovery |
| Seats nobody claims | Bots keep playing them |
| Building the APK | GitHub Actions CI, debug-signed |

These are settled and the phases below assume them.

## Phase 1 — Package the Game as an APK — **done**

The app is wrapped with Capacitor 8. The playable sources stay in the repo root
where the web, PWA and desktop envelopes already expect them; `npm run build`
copies them into a generated `www/`, and Capacitor bundles that.

- `npm run build` runs `tools/build/build-web.mjs`, which copies `index.html`,
  `game.js`, `styles.css`, `manifest.webmanifest` and `assets/` into `www/`.
- **`sw.js` is deliberately left out of the app.** The APK already carries every
  file on disk, so caching them again buys nothing and risks pinning a stale
  copy across an update. The build strips the registration block from its copy
  of `index.html` and fails loudly if that block ever stops matching, so the
  service worker cannot quietly reappear in a shipped build. The web version
  keeps its PWA behaviour untouched.
- `android/` holds the generated Gradle project and is committed, per Capacitor
  convention. `www/` and the copies Capacitor makes inside `android/` are not.
- Orientation is deliberately **not** locked. `fitStage()` already rotates the
  1280x720 table when a phone is held upright, so the game handles both.
- `tools/build/generate-android-assets.sh` renders the launcher icons (legacy,
  round and adaptive foreground) and the splash screens from `assets/icon.svg`
  and `assets/android/*.svg`. Re-run it whenever the art changes.

One thing the Capacitor template got wrong and this repo fixes: its `AppTheme`
referenced `@color/colorPrimary`, `colorPrimaryDark` and `colorAccent` without
defining them anywhere, which fails the resource compile. `values/colors.xml`
now defines them from the game's own palette.

## Phase 5 — Building and Shipping It — **done**

`.github/workflows/android.yml` builds the APK. It provisions Temurin JDK 21
(Capacitor 8 compiles its Android module against Java 21) and the Android SDK,
runs `npm ci && npm run sync`, then `./gradlew assembleDebug`.
Pushing a `v*` tag attaches the APK to the GitHub release; pushes to `main` and
pull requests build it as a workflow artifact, so a broken build is caught
without waiting for a release.

**Signing.** `android/debug.keystore` is committed on purpose. Gradle otherwise
generates a throwaway debug key per machine, which would mean every CI run
signed with a different key and a new APK could not install over the previous
one — and on this app, uninstalling takes the saved match with it. The password
is the Android debug default (`android`) and grants no trust. It is fine for
sideloading among friends and must never be used for a real release; that would
need a proper keystore in GitHub Actions secrets, never in the repo.

Building locally, if you have Android Studio:

```sh
npm install && npm run sync && cd android && ./gradlew assembleDebug
```

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

## What Is Left

Phases 2 and 3 are independent of each other and can be worked in parallel;
Phase 4 needs both. Phase 3 is the largest and deserves its own plan when it is
reached.

Because the build already runs, every one of those phases can be tested on a
real phone as it lands, rather than accumulating unverified work behind a
toolchain that was never proven.

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
