package com.cama.tablet

import android.util.Log
import com.cama.tablet.BuildConfig

/** 태블릿 앱 통합 로그 — logcat 필터: adb logcat -s CamaTablet:* */
object CamaTabletLog {
    const val TAG = "CamaTablet"

    fun v(message: String) {
        if (BuildConfig.DEBUG) Log.v(TAG, message)
    }

    fun d(message: String) {
        Log.d(TAG, message)
    }

    fun i(message: String) {
        Log.i(TAG, message)
    }

    fun w(message: String, throwable: Throwable? = null) {
        if (throwable != null) Log.w(TAG, message, throwable) else Log.w(TAG, message)
    }

    fun e(message: String, throwable: Throwable? = null) {
        if (throwable != null) Log.e(TAG, message, throwable) else Log.e(TAG, message)
    }

    fun ble(message: String) = i("[BLE] $message")

    fun web(message: String) = i("[WEB] $message")

    fun bridge(message: String) = i("[BRIDGE] $message")
}
