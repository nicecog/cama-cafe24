package com.cama.tablet

import android.webkit.JavascriptInterface
import org.json.JSONObject

class WebAppBridge(
    private val onGenerateQr: () -> Unit,
    private val onStopBle: () -> Unit,
    private val onClearHealthData: () -> Unit,
    private val onGetCapabilities: () -> JSONObject,
    private val onGetLastHealthData: () -> String?,
) {
    @JavascriptInterface
    fun generateQr() {
        onGenerateQr()
    }

    @JavascriptInterface
    fun stopBleSession() {
        onStopBle()
    }

    /** 새 QR 연결 시 이전 수신 데이터 초기화 */
    @JavascriptInterface
    fun clearLastHealthData() {
        onClearHealthData()
    }

    @JavascriptInterface
    fun getCapabilities(): String {
        return onGetCapabilities().toString()
    }

    @JavascriptInterface
    fun getBridgeVersion(): Int = 2

    /** WebView 이벤트 유실 시 폴백 — 마지막 수신 JSON */
    @JavascriptInterface
    fun getLastHealthData(): String {
        return onGetLastHealthData() ?: ""
    }
}
