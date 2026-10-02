# Android Release Plan: LAN Multiplayer

This is the plan for shipping Mahjong Vibes as an installable Android `.apk`
playable over a local network: one player creates the table, up to three others
join from their own phones.

**Phases 1, 2, 3 and 5 have landed.** The app packages and builds, and up to
four people can play one table across phones on the same network, with bots in
any empty chair. What is left is the lobby around it (Phase 4): names, a seat
list, and coming back after a dropped connection.

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

## Phase 2 — A Local Server on the Host Device — **done**

Joining was the easy half: `new WebSocket('ws://<host>:<port>')` works from
ordinary JavaScript inside the WebView, with no plugin and no permission beyond
the `INTERNET` Capacitor already declares.

Hosting needed native code, because a WebView can open a socket but never listen
on one. `LanServerPlugin` is that server. It exposes `start`, `stop`, `send`,
`broadcast` and `getAddress` to JavaScript, and emits `peerJoined`, `peerLeft`,
`peerMessage` and `serverError`. It moves text and nothing else: seats, hands and
turns stay in JavaScript, on the host.

`net.js` wraps both halves behind one shape — `openRoom` for the host,
`joinRoom` for guests — so the game will not care which side it is on.

Three decisions came out differently from the plan above:

- **Java, not Kotlin.** The Capacitor template is Java throughout and the project
  has no Kotlin toolchain. Adding the Kotlin Gradle plugin, its version
  alignment and its stdlib to carry one file was not worth it.
- **Java-WebSocket, not NanoWSD.** NanoWSD's last release was 2017 and it is an
  HTTP server with WebSocket bolted on. Java-WebSocket is maintained, is built
  for exactly this, and its server is four methods to override. With no device
  to test the host on, the smaller and better-maintained library was the safer
  bet.
- **No `ACCESS_WIFI_STATE`.** Reading the address off `NetworkInterface` instead
  of `WifiManager` needs no permission at all, and also works over a hotspot or
  ethernet.

**One thing that would have cost a debugging session on-device:** from
targetSdk 28 on, Android blocks cleartext traffic, so `ws://` fails inside the
WebView with nothing useful said about why. `network_security_config.xml` now
permits it. There is no certificate to validate on a living-room network and no
authority to issue one; nothing else in the app touches the network.

**What is verified, and what is not.** The guest half is tested: it connects to
a real WebSocket server, sends and receives, distinguishes hanging up from
being dropped, and fails fast on a bad address instead of hanging. The host half
has only been compiled. It needs two devices on one network to be called
working, which is the first thing to do with the next build.

## Phase 3 — Give Every Seat an Owner — **done**

The host runs the only real game. Guests are shown a view of it and send back
what their player wants to do; nothing a guest sends is trusted beyond what the
table would have offered them anyway.

**Every seat has an owner.** Players carry `controller` — `"host"`, `"guest"` or
`"bot"` — and the absolute `seat` they sit in. A solo match is just a table the
device holds with three bots, so solo play is the same code with nobody else
connected. The host always sits at seat 0.

**The data is turned, not the drawing.** The plan above proposed a
`visualSeat()` mapping applied throughout rendering. Reading the renderer showed
that everything — the hand, the action bar, the rivers, every message — already
assumes "you are seat 0". So `tableViewFor(state, seat)` rotates the table's data
so the recipient's own chair is seat 0, remapping every seat-valued field (turn,
dealer, last discarder, winner, who called which tile, offers). The renderer runs
unchanged on a guest, and there is one function to get right instead of a
mapping threaded through dozens of call sites.

**Concealment moved into the data.** `tableViewFor` also blanks every hand but
the recipient's, the wall and the dead wall (their lengths survive, since the
wall counter and haitei need them), strips connection ids, and drops any offer
not addressed to the recipient — an offer to someone else says they can win on,
or call, the tile just thrown.

**One door for moves.** Every button a player presses goes through `act()`. On
the host it is applied to seat 0 at once; on a guest it is sent as an intent.
`applyIntent(seat, intent)` re-checks each one against the table, and wherever
the table already knows something — who discarded, which tile — it uses that,
not what the message claimed.

**The action bar is read off the table.** Offers used to be pushed onto the bar
from the middle of the game logic. Now `viewerActions()` derives the bar from
state alone, which is what lets the host, a guest receiving a view, and a
reloaded save all show the same buttons without having seen the offer made.

**Claims with more than one person at the table.** A discard is offered to ron
first, in turn order from the discarder; a seat that passes lets the next one
be asked. Then pon and kan, then chi, which only the next seat may make. Bots
still never call.

**Timers can be cancelled.** Every pause the table takes goes through
`schedule()`, tagged with an epoch. A new hand, or sitting down at someone else's
table, bumps the epoch, so a bot's pending move fires into nothing instead of
acting on a table it was not meant for.

**Messages read right from every chair.** "You call Pon" on the caller's phone,
"Player 3 calls Pon" on the others. This also fixed "You draws" and "You
discards", which the solo game had always shown in English.

**Saves stay solo.** A shared table is never saved, and a guest never writes the
host's table into its own storage. The solo match each device had before
sitting down is left exactly where it was, and a guest goes back to it when the
room closes. Saves written by 1.1.0, before seats had owners, still load.

**Leaving is survivable.** A guest who drops is replaced by a bot that plays on
from where they were — on their own turn, in the middle of being offered a call,
or holding a ron, which the bot takes. When the host closes the room, every
guest's chair goes to a bot and the host's match continues as a solo one.

What it deliberately does not do yet:

- **Chankan is automatic** for people as well as bots. Offering it would need a
  kan to be resumable halfway through; declining a ron that good is rare.
- **Only the host deals the next hand.** Guests see the result and wait.
- **No rejoining.** A guest who drops stays a bot for the rest of the match.
- **The host's screen sleeping pauses the table**, since the WebView stops its
  timers. Untested on a phone.

### How it is tested

There is no phone here, so `npm test` plays shared matches between headless
devices: each is its own jsdom window, with its own storage, loading the real
`index.html`, `net.js` and `game.js`. They talk over real WebSockets through a
relay that stands in for `LanServerPlugin` — the host's `openRoom` is the only
thing replaced. Each scenario deals the host chosen hands and then has every
device press its own buttons: a guest winning by ron and by tsumo, a ron passed
on to the next claimant, pon outranking chi, open and closed kans, riichi and its
lock, a guest sending moves it was never offered, a guest dropping on its own
turn, during an offer and holding a ron, the room closing, and a 1.1.0 save
loading. The suite was checked against deliberately broken copies of the game —
leaking offers, unturned winners, reversed claim order — and catches each.

`npm run test:soak` plays whole matches at random, checking on every tick that
the 136 tiles are conserved, that no view carries a tile it should not, and that
every caught-up guest sees exactly the host's table turned to face it. The CI
runs `npm test` before building, so no APK ships if either breaks.

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

Already in place from Phase 3: the host can start a shared match with whoever is
connected, seated in join order with bots in the empty chairs, and a dropped
guest's chair goes to a bot. What remains is the lobby itself — names, the seat
list, the room code, rejoining with a token, seating people who connect after the
match started, and a guest's "New Match" button, which does nothing at a table it
does not hold.

## What Is Left

Phase 4, the lobby. The table it gathers people around already works; the lobby
is what makes it pleasant to gather them.

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
