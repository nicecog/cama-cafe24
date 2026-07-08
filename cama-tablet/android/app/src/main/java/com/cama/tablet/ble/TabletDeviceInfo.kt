package com.cama.tablet.ble

import android.bluetooth.BluetoothAdapter
import android.content.Context
import android.provider.Settings
import org.json.JSONObject

data class TabletDeviceInfo(
    val deviceId: String,
    val deviceName: String,
    val serviceUuid: String,
    val dataCharUuid: String,
) {
    fun toQrPayloadJson(): String {
        val json = JSONObject()
        json.put("v", BleConstants.QR_VERSION)
        json.put("app", BleConstants.QR_APP_ID)
        json.put("deviceId", deviceId)
        json.put("deviceName", deviceName)
        json.put("serviceUuid", serviceUuid)
        json.put("dataCharUuid", dataCharUuid)
        return json.toString()
    }

    companion object {
        fun from(context: Context): TabletDeviceInfo {
            val androidId = Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ANDROID_ID,
            ) ?: "unknown"

            val adapter = BluetoothAdapter.getDefaultAdapter()
            val name = adapter?.name?.takeIf { it.isNotBlank() }
                ?: "CAMA-Tablet-${androidId.takeLast(4).uppercase()}"

            return TabletDeviceInfo(
                deviceId = androidId,
                deviceName = name,
                serviceUuid = BleConstants.SERVICE_UUID.toString(),
                dataCharUuid = BleConstants.HEALTH_DATA_CHAR_UUID.toString(),
            )
        }
    }
}
