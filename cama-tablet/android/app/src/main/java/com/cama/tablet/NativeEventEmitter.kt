package com.cama.tablet

import android.webkit.WebView
import org.json.JSONObject

/** WebView로 네이티브 이벤트를 주입하는 헬퍼 */
class NativeEventEmitter(private val webViewProvider: () -> WebView) {

    fun emit(type: String, ok: Boolean = true, payload: JSONObject? = null, error: String? = null) {
        val json = JSONObject()
        json.put("type", type)
        json.put("ok", ok)
        if (payload != null) json.put("payload", payload)
        if (error != null) json.put("error", error)

        val script =
            "(function(){window.dispatchEvent(new CustomEvent('cama-tablet-native',{detail:$json}));})();"

        webViewProvider().post {
            webViewProvider().evaluateJavascript(script, null)
        }
    }

    fun emitQrStarted(qrPayload: String) {
        val payload = JSONObject()
        payload.put("qrPayload", qrPayload)
        emit("bleSessionStarted", ok = true, payload = payload)
    }

    fun emitHealthData(json: String) {
        val payload = JSONObject(json)
        emit("healthDataReceived", ok = true, payload = payload)
    }

    fun emitConnected(deviceName: String?) {
        val payload = JSONObject()
        payload.put("deviceName", deviceName ?: "연결된 기기")
        emit("bleConnected", ok = true, payload = payload)
    }

    fun emitDisconnected() {
        emit("bleDisconnected", ok = true)
    }

    fun emitError(message: String) {
        emit("bleError", ok = false, error = message)
    }
}
