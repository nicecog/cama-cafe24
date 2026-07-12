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

        val jsonLen = json.toString().length
        CamaTabletLog.bridge("emit type=$type ok=$ok jsonLen=$jsonLen error=$error")

        val quoted = JSONObject.quote(json.toString())
        val script =
            "(function(){try{var d=JSON.parse($quoted);" +
            "window.dispatchEvent(new CustomEvent('cama-tablet-native',{detail:d}));" +
            "return 'ok';}catch(e){console.error('cama-tablet-native emit failed',e);return 'err:'+e;}})();"

        webViewProvider().post {
            webViewProvider().evaluateJavascript(script) { result ->
                CamaTabletLog.bridge("emit $type evaluateJs result=$result")
            }
        }
    }

    fun emitQrStarted(qrPayload: String) {
        val payload = JSONObject()
        payload.put("qrPayload", qrPayload)
        emit("bleSessionStarted", ok = true, payload = payload)
    }

    fun emitHealthData(json: String) {
        CamaTabletLog.bridge("emitHealthData rawLen=${json.length} preview=${json.take(120)}")
        try {
            val payload = JSONObject(json)
            emit("healthDataReceived", ok = true, payload = payload)
        } catch (e: Exception) {
            CamaTabletLog.e("emitHealthData JSON parse failed", e)
            emitError("수신 데이터 파싱 실패: ${e.message}")
        }
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
        CamaTabletLog.w("emitError: $message")
        emit("bleError", ok = false, error = message)
    }
}
