package com.vagnertxr.mahjongvibes;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Registered before the bridge starts so the web layer can ask whether
        // this device is able to hold a table as soon as it loads.
        registerPlugin(LanServerPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
