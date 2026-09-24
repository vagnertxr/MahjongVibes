// Copies the playable static files into www/, the directory Capacitor bundles
// into the Android app. The sources stay where they are so the web, PWA and
// desktop envelopes keep working from the repo root, untouched.
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = join(ROOT, "www");

// sw.js is deliberately absent: the app already carries these files on disk, so
// caching them a second time buys nothing and risks pinning a stale copy across
// an app update.
const FILES = ["index.html", "game.js", "net.js", "styles.css", "manifest.webmanifest"];
const DIRS = ["assets"];

const SW_REGISTRATION = /\n *<script>\s*if \("serviceWorker" in navigator[\s\S]*?<\/script>/;

async function packageIndexHtml() {
  const html = await readFile(join(ROOT, "index.html"), "utf8");
  if (!SW_REGISTRATION.test(html)) {
    throw new Error(
      "index.html no longer matches the service worker registration block this " +
      "build strips. Check what changed before shipping an Android build."
    );
  }
  await writeFile(join(OUT, "index.html"), html.replace(SW_REGISTRATION, ""), "utf8");
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  for (const file of FILES) {
    if (file === "index.html") continue;
    await cp(join(ROOT, file), join(OUT, file));
  }
  for (const dir of DIRS) {
    await cp(join(ROOT, dir), join(OUT, dir), { recursive: true });
  }
  await packageIndexHtml();

  console.log(`Packaged the table into ${OUT}`);
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
