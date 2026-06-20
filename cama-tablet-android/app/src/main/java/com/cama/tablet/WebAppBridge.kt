package com.cama.tablet

import android.webkit.JavascriptInterface

class WebAppBridge(
    private val onStartQrScan: () -> Unit,
) {
    @JavascriptInterface
    fun startQrScan() {
        onStartQrScan()
    }
}
