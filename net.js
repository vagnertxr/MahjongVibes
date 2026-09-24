// Carries messages between phones on the same network.
//
// Two halves that look the same from the outside. Hosting needs the native
// plugin, because a WebView cannot listen on a socket; joining is an ordinary
// WebSocket and works anywhere, including a desktop browser. Everything here
// moves strings: seats, hands and turns are the game's business, not this file's.
const LanNet = (() => {
  const DEFAULT_PORT = 8787;
  const PLUGIN_NAME = "LanServer";

  function plugin() {
    const capacitor = window.Capacitor;
    if (!capacitor?.isNativePlatform?.()) return null;
    return capacitor.Plugins?.[PLUGIN_NAME] ?? null;
  }

  // Only the app build can hold a table. In a browser the join half still works,
  // so the UI should offer joining and explain why hosting is missing.
  function canHost() {
    return plugin() !== null;
  }

  async function hostAddress() {
    const native = plugin();
    if (!native) return null;
    const { address } = await native.getAddress();
    return address ?? null;
  }

  // A room the guests connect to. `handlers` takes onPeerJoined, onPeerLeft,
  // onMessage and onError, all optional.
  async function openRoom({ port = DEFAULT_PORT, ...handlers } = {}) {
    const native = plugin();
    if (!native) throw new Error("This build cannot host a table.");

    const listeners = [
      await native.addListener("peerJoined", e => handlers.onPeerJoined?.(e.clientId)),
      await native.addListener("peerLeft", e => handlers.onPeerLeft?.(e.clientId)),
      await native.addListener("peerMessage", e => handlers.onMessage?.(e.clientId, decode(e.message))),
      await native.addListener("serverError", e => handlers.onError?.(new Error(e.message)))
    ];

    let open;
    try {
      open = await native.start({ port });
    } catch (error) {
      await Promise.all(listeners.map(l => l.remove()));
      throw error;
    }

    return {
      address: open.address ?? null,
      port: open.port ?? port,
      send: (clientId, message) => native.send({ clientId, message: encode(message) }),
      broadcast: message => native.broadcast({ message: encode(message) }),
      async close() {
        await Promise.all(listeners.map(l => l.remove()));
        await native.stop();
      }
    };
  }

  // Join a room being held by another device. Resolves once the socket is open
  // so the caller can tell "connected" from "wrong address" without guessing.
  function joinRoom({ address, port = DEFAULT_PORT, ...handlers } = {}) {
    return new Promise((resolve, reject) => {
      let socket;
      try {
        socket = new WebSocket(buildUrl(address, port));
      } catch (error) {
        reject(error);
        return;
      }

      let settled = false;

      socket.addEventListener("open", () => {
        settled = true;
        resolve({
          send: message => socket.send(encode(message)),
          close: () => socket.close()
        });
      });

      socket.addEventListener("message", event => handlers.onMessage?.(decode(event.data)));

      socket.addEventListener("close", event => {
        // A socket that closes before it ever opened is a failure to connect,
        // not a host that hung up, and the caller is still waiting on a promise.
        if (!settled) {
          settled = true;
          reject(new Error("Could not reach that table."));
          return;
        }
        handlers.onClose?.({ code: event.code, clean: event.wasClean });
      });

      // A browser reports connection failures as a bare error with no detail,
      // then closes; the close handler above is what turns it into a rejection.
      socket.addEventListener("error", () => handlers.onError?.(new Error("Connection lost.")));
    });
  }

  // Accepts what someone would actually type: an address on its own, with a
  // port, or with a ws:// already on the front.
  function buildUrl(address, port) {
    const trimmed = String(address ?? "").trim();
    if (!trimmed) throw new Error("No address given.");
    if (/^wss?:\/\//i.test(trimmed)) return trimmed;
    return /:\d+$/.test(trimmed) ? `ws://${trimmed}` : `ws://${trimmed}:${port}`;
  }

  function encode(message) {
    return typeof message === "string" ? message : JSON.stringify(message);
  }

  // Messages arrive as text. Anything that is not JSON is handed back as it
  // came, so a stray frame cannot take the connection down.
  function decode(raw) {
    if (typeof raw !== "string") return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  return { DEFAULT_PORT, canHost, hostAddress, openRoom, joinRoom, buildUrl };
})();
