package com.vagnertxr.mahjongvibes;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.drafts.Draft_6455;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.net.URISyntaxException;

/**
 * Lets this device sit at a table another phone is holding.
 *
 * The app's page is served over https://localhost, and a page served over
 * https may not open a plain ws:// connection: the WebView refuses it as mixed
 * content, whatever the network security config allows. A table on a living
 * room's Wi-Fi has no certificate to offer, so the connection is made here, in
 * native code, where those rules do not apply. Like LanServerPlugin, it carries
 * text and nothing else.
 */
@CapacitorPlugin(name = "LanClient")
public class LanClientPlugin extends Plugin {

    private static final int CONNECT_TIMEOUT_MS = 8000;

    private Client client;

    @PluginMethod
    public void connect(PluginCall call) {
        String url = call.getString("url");
        if (url == null) {
            call.reject("No address given.");
            return;
        }
        closeClient();
        try {
            client = new Client(new URI(url), call);
            client.connect();
        } catch (URISyntaxException error) {
            client = null;
            call.reject("That is not an address a table can be at.");
        }
    }

    @PluginMethod
    public void send(PluginCall call) {
        String message = call.getString("message");
        Client current = client;
        if (message == null || current == null || !current.isOpen()) {
            call.reject("Not connected to a table.");
            return;
        }
        current.send(message);
        call.resolve();
    }

    @PluginMethod
    public void close(PluginCall call) {
        closeClient();
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        closeClient();
    }

    private void closeClient() {
        Client current = client;
        client = null;
        if (current != null) current.close();
    }

    private class Client extends WebSocketClient {

        // Answered once: by the connection opening, or by it failing first.
        private PluginCall connectCall;
        private boolean opened = false;

        Client(URI uri, PluginCall connectCall) {
            // A wrong address on a home network would otherwise hang for over
            // a minute before the system gave up on it.
            super(uri, new Draft_6455(), null, CONNECT_TIMEOUT_MS);
            this.connectCall = connectCall;
        }

        @Override
        public void onOpen(ServerHandshake handshake) {
            opened = true;
            if (connectCall != null) connectCall.resolve();
            connectCall = null;
        }

        @Override
        public void onMessage(String message) {
            if (client != this) return;
            JSObject event = new JSObject();
            event.put("message", message);
            notifyListeners("message", event);
        }

        @Override
        public void onClose(int code, String reason, boolean remote) {
            // A connection that never opened is a failure to reach the table,
            // reported to whoever asked to connect, not a host that hung up.
            if (!opened) {
                if (connectCall != null) connectCall.reject("Could not reach that table.");
                connectCall = null;
                return;
            }
            if (client != this) return;
            JSObject event = new JSObject();
            event.put("code", code);
            event.put("remote", remote);
            notifyListeners("close", event);
        }

        @Override
        public void onError(Exception error) {
            if (!opened || client != this) return;
            JSObject event = new JSObject();
            event.put("message", error.getMessage());
            notifyListeners("error", event);
        }
    }
}
