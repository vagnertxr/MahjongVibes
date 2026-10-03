// The shared table, played by the real Android app on an emulator.
//
// Everything in tests/*.test.mjs runs the game in jsdom, served over http. The
// app is different in ways that only show on Android: its page is served over
// https://localhost, so the WebView applies mixed-content rules a test page
// never meets, and hosting goes through LanServerPlugin in Java. This drives
// the app's WebView over the Chrome DevTools Protocol and plays both roles
// against headless devices running on the machine the emulator runs on:
//
//   1. the app joins a table held in Node (the emulator reaches the machine
//      at 10.0.2.2);
//   2. the app holds the table and a Node guest joins it (through adb forward).
//
// Run with an emulator up and the debug APK at the path below:
//   node tests/device/android-e2e.mjs android/app/build/outputs/apk/debug/app-debug.apk
import { execSync } from "node:child_process";
import WebSocket from "ws";
import { startRelay, device, wait } from "../support/table.mjs";

const PKG = "com.vagnertxr.mahjongvibes";
const APK = process.argv[2] ?? "android/app/build/outputs/apk/debug/app-debug.apk";
const sh = command => execSync(command, { encoding: "utf8" }).trim();
const report = { steps: [], failures: [] };
const step = (name, ok, detail) => {
  report.steps.push({ name, ok: !!ok, ...(detail === undefined ? {} : { detail }) });
  if (!ok) report.failures.push(name);
};

async function poll(check, ms) {
  const started = Date.now();
  while (Date.now() - started < ms) {
    if (await check()) return true;
    await wait(250);
  }
  return false;
}

// Talks to the app's WebView through its DevTools socket.
async function attachToApp() {
  let socketName = null;
  await poll(() => {
    const match = sh("adb shell cat /proc/net/unix").match(/@(webview_devtools_remote_\d+)/);
    socketName = match?.[1] ?? null;
    return socketName !== null;
  }, 30000);
  if (!socketName) throw new Error("the app's WebView never opened a DevTools socket");
  sh(`adb forward tcp:9222 localabstract:${socketName}`);
  let target = null;
  await poll(async () => {
    const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json().catch(() => []);
    target = targets.find(t => t.type === "page" && t.url.startsWith("https://localhost"));
    return !!target;
  }, 30000);
  if (!target) throw new Error("no page at https://localhost in the app's WebView");
  const socket = new WebSocket(target.webSocketDebuggerUrl, { perMessageDeflate: false });
  await new Promise((resolve, reject) => { socket.once("open", resolve); socket.once("error", reject); });
  let nextId = 1;
  const pending = new Map();
  socket.on("message", raw => {
    const message = JSON.parse(raw.toString());
    pending.get(message.id)?.(message);
    pending.delete(message.id);
  });
  const evaluate = expression => new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, message => {
      const details = message.result?.exceptionDetails;
      if (details) reject(new Error(details.exception?.description ?? details.text));
      else resolve(message.result?.result?.value);
    });
    socket.send(JSON.stringify({ id, method: "Runtime.evaluate", params: { expression, returnByValue: true, awaitPromise: true } }));
  });
  return { evaluate, url: target.url, close: () => socket.close() };
}

async function main() {
  sh(`adb install -r ${APK}`);
  sh(`adb shell pm clear ${PKG}`);
  sh(`adb shell am start -W -n ${PKG}/.MainActivity`);
  const app = await attachToApp();
  step("the app's page is served over https", app.url.startsWith("https://"), app.url);
  await poll(async () => (await app.evaluate("typeof joinLanRoom")) === "function", 20000);
  step("the app can hold a table", await app.evaluate("LanNet.canHost()"));

  // 1. The app joins a table held elsewhere.
  const relay = await startRelay();
  const port = relay.address.split(":")[1];
  const host = device("host", { relay });
  await wait(300);
  host.run("closeWelcome(); els.lanName.value = 'Node host'; onNameChanged(); hostLanRoom();");
  await poll(() => host.run("lanConnection?.kind") === "host", 5000);

  await app.evaluate(`closeWelcome(); els.lanName.value = 'Emulator'; onNameChanged();
    els.lanAddress.value = '10.0.2.2:${port}'; joinLanRoom(); 'started'`);
  const joined = await poll(async () => (await app.evaluate("lanConnection?.kind")) === "guest", 15000);
  step("the app joins a table on the network", joined, await app.evaluate("els.lanStatus.textContent"));
  const introduced = await poll(() => host.run("[...lanConnection.members.values()].some(m => m.name === 'Emulator')"), 10000);
  step("the host learns the app's player by name", introduced);
  if (joined) {
    host.run("startSharedMatch()");
    const seated = await poll(async () => await app.evaluate("isGuest()"), 15000);
    step("the app is dealt in and shown the table", seated);
    if (seated) {
      const view = await app.evaluate("({ hand: state.players[0].hand.length, hidden: state.players[1].hand.every(t => t === null), names: [0,1,2,3].map(i => document.querySelector('#seat-' + i + ' .name').textContent.trim()) })");
      step("the app sees its own hand and nobody else's", view.hand >= 13 && view.hidden, view);
      sh("adb exec-out screencap -p > screens/app-as-guest.png");
    }
  }
  host.run("leaveLanRoom()");
  await poll(async () => !(await app.evaluate("isGuest()")), 10000);
  host.close();
  await relay.close();

  // 2. The app holds the table; a guest reaches it through adb forward.
  await app.evaluate("closeLanPanel(); openLanPanel(); hostLanRoom(); 'started'");
  const hosting = await poll(async () => (await app.evaluate("lanConnection?.kind")) === "host", 15000);
  step("the app opens a room", hosting, await app.evaluate("els.lanStatus.textContent"));
  if (hosting) {
    sh("adb forward tcp:8790 tcp:8787");
    const guest = device("guest");
    await wait(300);
    guest.run("closeWelcome(); els.lanName.value = 'Node guest'; onNameChanged(); els.lanAddress.value = '127.0.0.1:8790'; joinLanRoom();");
    const arrived = await poll(async () => (await app.evaluate("lanConnection.peers.size")) === 1, 15000);
    step("a guest reaches the app's room", arrived, guest.run("els.lanStatus.textContent"));
    if (arrived) {
      await poll(async () => (await app.evaluate("lanLobby?.seats?.[1]?.name")) === "Node guest", 5000);
      await app.evaluate("startSharedMatch(); 'started'");
      const seated = await poll(() => guest.run("isGuest()"), 15000);
      step("the guest is dealt in by the app", seated);
      if (seated) {
        const names = guest.run("[0,1,2,3].map(i => document.querySelector('#seat-' + i + ' .name').textContent.trim())");
        step("the guest sees the app's player as the host", names.includes("Emulator"), names);
        sh("adb exec-out screencap -p > screens/app-as-host.png");
      }
    }
    guest.close();
  }
  app.close();
}

execSync("mkdir -p screens");
main()
  .catch(error => step("the run finished", false, error.message))
  .finally(() => {
    console.log(JSON.stringify(report, null, 2));
    process.exit(report.failures.length ? 1 : 0);
  });
