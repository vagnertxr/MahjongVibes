# Android Release Plan: LAN Multiplayer

This is the plan for shipping Mahjong Vibes as an installable Android `.apk`
playable over a local network: one player creates the table, up to three others
join from their own phones.

**All five phases have landed.** The app packages and builds, and up to four
people can play one table across phones on the same network: they gather in a
lobby by name, bots take any empty chair, someone whose connection drops can
come back to their chair and their hand, and someone who arrives late is dealt
in at the next hand. What is left is mostly proving it on real phones — see
[What Is Left](#what-is-left).

The companion document [RELEASE.md](RELEASE.md) covers the shipping web, PWA and
desktop envelopes, all of which stay as they are. The Android app is another
envelope around the same static files, not a fork of them.

## Where It Started

Worth keeping, because it explains the shape of the phases:

- There was **no networking code of any kind**. No WebSocket, no WebRTC, no
  fetch to another host. `tools/server.py` binds `0.0.0.0` and prints the LAN
  address, but it only serves static files — a debug convenience, not a backend.
- **Seat 0 was the human, structurally.** `state.players[0]` and `seat === 0`
  were hardcoded in roughly a dozen places, with no per-seat role. Phase 3 is
  what replaced that.
- The bot AI (`chooseBotDiscard`, `tileValue`) was small and cleanly isolated,
  which made it easy to keep as the player for unclaimed and abandoned chairs.

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

Joining looked like the easy half: `new WebSocket('ws://<host>:<port>')` from
ordinary JavaScript. It works in a browser page served over http, but not in the
app: Capacitor serves the page from `https://localhost`, and the WebView refuses
an insecure `ws://` connection from a secure page. So the app joins through a
second small plugin, `LanClientPlugin` (a WebSocket client in Java, the same
library as the server), and `net.js` only falls back to the browser's
`WebSocket` outside the app. A browser on an https page — GitHub Pages, for
one — cannot join at all and says so.

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
- **No rejoining** — until Phase 4, which added it.
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

## Phase 4 — Creating and Joining a Table — **done**

**Names.** Everyone types a name in the Network panel; it is remembered on the
device. The host's chair shows the host's name to the guests, and each guest's
chair shows theirs. Without a name, a chair reads "Host" or "Player 3".

Names are typed on other people's phones and are drawn into every device's
markup, so they are treated as hostile: cut down on arrival to sixteen
characters of plain text, and escaped wherever they meet HTML. A name like
`<img src=x onerror=…>` arrives on every screen as those characters. The lobby
list is built from text nodes and never touches markup at all.

**The lobby.** The panel lists the four chairs in turn order, by name, marking
which is yours: the host, the guests in the order they arrived, and "Empty — a
bot plays" for the rest. Every guest sees the same list, sent by the host as
people come and go. The host can start whenever they like.

**Coming back.** Each device makes itself a random token, keeps it, and sends it
when it joins. It is never shown to anyone else, so nobody can claim a chair by
quoting it. When a guest drops, a bot plays their chair, but the chair is held
for them for the rest of the match; reconnecting with the same token puts them
back in it, with the hand they left. This also covers the common Wi-Fi case of a
phone reconnecting before the host has noticed its old connection die: the
chair moves to the new connection, and the stale one can no longer act for it or
hand the chair to a bot when it finally closes.

**Arriving late.** Someone who connects while a match is on waits, and is dealt
in at the next hand into a bot's chair — never into a chair being kept for
someone who left. If there is none, they wait for the next match, which frees
the chairs of people who did not come back. Anyone past the third guest waits
the same way.

**The guest's New Match button** is hidden while they are seated, since only the
host can deal a new match. It comes back when they leave.

Two things came out differently from the plan above:

- **No room code.** It was meant as a visual check that people had typed the
  right address. The host's name in the lobby does the same job, and is one
  thing fewer to read aloud across a room.
- **The connection test is gone.** Phase 2's "Send Test Message" button proved
  two phones could reach each other. A lobby that fills with names proves the
  same thing, and the button would only confuse players. The event log stays,
  because it is what helps when something goes wrong on a phone.

The lobby is covered by `tests/lobby.test.mjs` alongside the table's own tests:
names everywhere, a hostile name kept as text, a name changed mid-match,
reconnecting to the same chair and hand, a reconnect that beats the old
connection's timeout, late arrivals skipping kept chairs, and a fourth guest
waiting. Each was checked against a deliberately broken copy of the game.

## What Is Left

- **No match between two real phones yet.** `tests/device/android-e2e.mjs`
  runs the real app on an Android emulator and plays both roles against a Node
  device — the app joining a table, and the app holding one — which is how the
  https problem above was found and its fix proven. Two phones on one Wi-Fi is
  still the test that matters most.
- **A sleeping host pauses the table.** When the host's screen turns off, the
  WebView stops its timers and the bots stop moving. Keeping the screen awake
  would need another native plugin, and should wait until a real match shows
  how much it matters.
- **Chankan is automatic**, and **only the host deals the next hand** — both
  deliberate, both described under Phase 3.
- **Play Store distribution** is out of scope for a sideloaded LAN game; see
  below for what it would take.

## Assumptions Worth Revisiting

These were resolved toward the simplest option rather than asked about. Any of
them can be reopened, but each would change scope:

- **Sideload only, no Play Store.** This is what makes debug signing adequate.
  Store distribution would require a release keystore, a privacy policy, content
  rating and review.
- **The `android/` project is committed.** Capacitor's convention, but it is a
  large generated tree in a repo that has so far stayed very small.
- **No room code.** The host's name in the lobby confirms people reached the
  right table.
- **The host plays too.** The hosting device occupies a seat rather than acting
  as a dedicated referee.
