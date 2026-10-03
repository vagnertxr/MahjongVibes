package com.vagnertxr.mahjongvibes;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;

import java.util.Locale;

public class MainActivity extends BridgeActivity {

    // The last safe area worked out, kept so a page that loads after it was
    // measured can still be told.
    private String safeAreaScript = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Registered before the bridge starts so the web layer can ask whether
        // this device is able to hold a table as soon as it loads.
        registerPlugin(LanServerPlugin.class);
        registerPlugin(LanClientPlugin.class);
        super.onCreate(savedInstanceState);
        drawIntoCutout();
        hideSystemBars();
        publishSafeArea();
    }

    // Android shows the bars again after a dialog, the keyboard or a trip to
    // another app; taking focus back is the moment to put them away again.
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemBars();
    }

    /**
     * A game owns the whole screen. The status bar and the gesture bar are
     * hidden, and a swipe from the edge brings them back over the table for a
     * moment rather than pushing the table aside.
     */
    private void hideSystemBars() {
        Window window = getWindow();
        WindowCompat.setDecorFitsSystemWindows(window, false);
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
        controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        controller.hide(WindowInsetsCompat.Type.systemBars());
    }

    /**
     * Held sideways, the front camera sits at one end of the screen. Without
     * this the window stops short of it and leaves a dark band the full height
     * of the phone. The cloth is drawn there; the table itself is kept clear of
     * the camera by the page, which is told where it is below.
     */
    private void drawIntoCutout() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.P) return;
        WindowManager.LayoutParams attributes = getWindow().getAttributes();
        attributes.layoutInDisplayCutoutMode = Build.VERSION.SDK_INT >= Build.VERSION_CODES.R
            ? WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS
            : WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        getWindow().setAttributes(attributes);
    }

    /**
     * Tells the page where the camera and any visible bar are, as
     * --safe-area-inset-* on the root, and never pads the window for them.
     *
     * Capacitor's own handling (switched off in capacitor.config.json) does
     * this only on WebView 140 and later; on anything older it pads the whole
     * window instead, which leaves a band down the camera's side. The page
     * fits the table inside these values and lets the cloth run underneath.
     */
    private void publishSafeArea() {
        View decor = getWindow().getDecorView();
        ViewCompat.setOnApplyWindowInsetsListener(decor, (view, insets) -> {
            Insets safe = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            // The keyboard is the one thing still allowed to push the page up,
            // so a name or address being typed stays in sight.
            boolean typing = insets.isVisible(WindowInsetsCompat.Type.ime());
            view.setPadding(0, 0, 0, typing ? insets.getInsets(WindowInsetsCompat.Type.ime()).bottom : 0);

            float density = getResources().getDisplayMetrics().density;
            safeAreaScript = String.format(
                Locale.US,
                "(function (s) { s.setProperty('--safe-area-inset-top', '%.1fpx');"
                    + " s.setProperty('--safe-area-inset-right', '%.1fpx');"
                    + " s.setProperty('--safe-area-inset-bottom', '%.1fpx');"
                    + " s.setProperty('--safe-area-inset-left', '%.1fpx'); })(document.documentElement.style);",
                safe.top / density,
                safe.right / density,
                typing ? 0f : safe.bottom / density,
                safe.left / density
            );
            runSafeAreaScript();
            return insets;
        });

        getBridge().addWebViewListener(new WebViewListener() {
            @Override
            public void onPageLoaded(WebView webView) {
                runSafeAreaScript();
            }
        });
    }

    private void runSafeAreaScript() {
        if (safeAreaScript == null || getBridge() == null || getBridge().getWebView() == null) return;
        String script = safeAreaScript;
        getBridge().executeOnMainThread(() -> getBridge().getWebView().evaluateJavascript(script, null));
    }
}
