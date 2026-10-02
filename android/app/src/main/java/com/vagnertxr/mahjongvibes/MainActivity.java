package com.vagnertxr.mahjongvibes;

import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Registered before the bridge starts so the web layer can ask whether
        // this device is able to hold a table as soon as it loads.
        registerPlugin(LanServerPlugin.class);
        super.onCreate(savedInstanceState);
        drawIntoCutout();
        hideSystemBars();
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
     * the camera by the page, which reads the safe area.
     */
    private void drawIntoCutout() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.P) return;
        WindowManager.LayoutParams attributes = getWindow().getAttributes();
        attributes.layoutInDisplayCutoutMode = Build.VERSION.SDK_INT >= Build.VERSION_CODES.R
            ? WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS
            : WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        getWindow().setAttributes(attributes);
    }
}
