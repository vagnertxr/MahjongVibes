package com.vagnertxr.mahjongvibes;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.NetworkInterface;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Lets this device hold the table for others on the same network.
 *
 * A WebView can open a socket but cannot listen on one, so the host side of a
 * LAN game has to live here in native code. Guests need none of this: they
 * reach the host with an ordinary `new WebSocket("ws://...")`.
 *
 * This plugin only carries text between devices. It knows nothing about hands,
 * seats or turns — the game logic stays in JavaScript, on the host.
 */
@CapacitorPlugin(name = "LanServer")
public class LanServerPlugin extends Plugin {

    private Server server;
    private final Map<String, WebSocket> clients = new ConcurrentHashMap<>();
    private final AtomicInteger nextClientId = new AtomicInteger(1);

    @PluginMethod
    public void start(PluginCall call) {
        if (server != null) {
            call.reject("A room is already open on this device.");
            return;
        }
        int port = call.getInt("port", 8787);
        try {
            server = new Server(port);
            // Without this a crashed room leaves the port unusable until the OS
            // releases it, so reopening a room would fail for no visible reason.
            server.setReuseAddr(true);
            server.start();
            JSObject result = new JSObject();
            result.put("port", port);
            result.put("address", lanAddress());
            call.resolve(result);
        } catch (Exception error) {
            server = null;
            call.reject("Could not open the room: " + error.getMessage(), error);
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        closeServer();
        call.resolve();
    }

    @PluginMethod
    public void broadcast(PluginCall call) {
        String message = call.getString("message");
        if (message == null) {
            call.reject("No message to send.");
            return;
        }
        for (WebSocket client : clients.values()) {
            if (client.isOpen()) client.send(message);
        }
        call.resolve();
    }

    @PluginMethod
    public void send(PluginCall call) {
        String clientId = call.getString("clientId");
        String message = call.getString("message");
        if (clientId == null || message == null) {
            call.reject("Both clientId and message are required.");
            return;
        }
        WebSocket client = clients.get(clientId);
        if (client == null || !client.isOpen()) {
            call.reject("That player is no longer connected.");
            return;
        }
        client.send(message);
        call.resolve();
    }

    @PluginMethod
    public void getAddress(PluginCall call) {
        JSObject result = new JSObject();
        result.put("address", lanAddress());
        call.resolve(result);
    }

    @Override
    protected void handleOnDestroy() {
        closeServer();
    }

    private void closeServer() {
        if (server == null) return;
        try {
            server.stop();
        } catch (Exception ignored) {
            // Nothing useful to do if it was already down.
        }
        server = null;
        clients.clear();
    }

    /**
     * The address guests type in. Read off the network interfaces rather than
     * WifiManager so it also works over a hotspot or ethernet, and so the app
     * needs no extra permission to find it.
     */
    private String lanAddress() {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface candidate : interfaces) {
                if (candidate.isLoopback() || !candidate.isUp()) continue;
                for (InetAddress address : Collections.list(candidate.getInetAddresses())) {
                    if (address.isLoopbackAddress()) continue;
                    String host = address.getHostAddress();
                    // IPv4 only: this is an address someone reads aloud and types
                    // into another phone, and an IPv6 one is hopeless for that.
                    if (host != null && host.indexOf(':') < 0) return host;
                }
            }
        } catch (Exception ignored) {
            // Falls through to the unknown case below.
        }
        return null;
    }

    private class Server extends WebSocketServer {

        Server(int port) {
            super(new InetSocketAddress(port));
        }

        @Override
        public void onOpen(WebSocket socket, ClientHandshake handshake) {
            String clientId = String.valueOf(nextClientId.getAndIncrement());
            socket.setAttachment(clientId);
            clients.put(clientId, socket);
            JSObject event = new JSObject();
            event.put("clientId", clientId);
            notifyListeners("peerJoined", event);
        }

        @Override
        public void onClose(WebSocket socket, int code, String reason, boolean remote) {
            String clientId = socket.getAttachment();
            if (clientId == null) return;
            clients.remove(clientId);
            JSObject event = new JSObject();
            event.put("clientId", clientId);
            notifyListeners("peerLeft", event);
        }

        @Override
        public void onMessage(WebSocket socket, String message) {
            String clientId = socket.getAttachment();
            if (clientId == null) return;
            JSObject event = new JSObject();
            event.put("clientId", clientId);
            event.put("message", message);
            notifyListeners("peerMessage", event);
        }

        @Override
        public void onError(WebSocket socket, Exception error) {
            JSObject event = new JSObject();
            event.put("message", error.getMessage());
            notifyListeners("serverError", event);
        }

        @Override
        public void onStart() {
            // Required by WebSocketServer; the JS side already knows the room
            // opened because start() resolved.
        }
    }
}
