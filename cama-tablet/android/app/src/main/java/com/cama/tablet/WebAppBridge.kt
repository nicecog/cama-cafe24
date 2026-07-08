package com.cama.tablet

import android.webkit.JavascriptInterface
import org.json.JSONObject

class WebAppBridge(
    private val onGenerateQr: () -> Unit,
    private val onStopBle: () -> Unit,
    private val onGetCapabilities: () -> JSONObject,
) {
    @JavascriptInterface
    fun generateQr() {
        onGenerateQr()
    }

    @JavascriptInterface
    fun stopBleSession() {
        onStopBle()
    }

    @JavascriptInterface
    fun getCapabilities(): String {
        return onGetCapabilities().toString()
    }

    @JavascriptInterface
    fun getBridgeVersion(): Int = 1
}
