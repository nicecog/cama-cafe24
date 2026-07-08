package com.cama.tablet.ble

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCharacteristic
import android.bluetooth.BluetoothGattDescriptor
import android.bluetooth.BluetoothGattServer
import android.bluetooth.BluetoothGattServerCallback
import android.bluetooth.BluetoothGattService
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.BluetoothLeAdvertiser
import android.content.Context
import android.os.Build
import android.os.ParcelUuid
import android.util.Log
import java.nio.charset.StandardCharsets

/**
 * 태블릿 BLE Peripheral — GATT 서버 + 광고.
 * 폰 앱이 QR의 serviceUuid로 연결 후 HEALTH_DATA characteristic에 JSON write.
 */
class BleGattServerManager(
    private val context: Context,
    private val listener: Listener,
) {
    interface Listener {
        fun onSessionStarted(qrPayload: String)
        fun onDeviceConnected(deviceName: String?)
        fun onDeviceDisconnected()
        fun onHealthDataReceived(json: String)
        fun onError(message: String)
    }

    private val tag = "BleGattServer"
    private val bluetoothManager =
        context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
    private val adapter: BluetoothAdapter? = bluetoothManager.adapter

    private var gattServer: BluetoothGattServer? = null
    private var advertiser: BluetoothLeAdvertiser? = null
    private var statusCharacteristic: BluetoothGattCharacteristic? = null
    private var connectedDevice: BluetoothDevice? = null
    private var isRunning = false

    private val writeBuffer = StringBuilder()

    private val gattCallback = object : BluetoothGattServerCallback() {
        override fun onConnectionStateChange(device: BluetoothDevice, status: Int, newState: Int) {
            when (newState) {
                BluetoothProfile.STATE_CONNECTED -> {
                    connectedDevice = device
                    val name = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        try {
                            device.name
                        } catch (_: SecurityException) {
                            null
                        }
                    } else {
                        @Suppress("DEPRECATION")
                        device.name
                    }
                    listener.onDeviceConnected(name)
                    notifyStatus("connected")
                }
                BluetoothProfile.STATE_DISCONNECTED -> {
                    connectedDevice = null
                    writeBuffer.clear()
                    listener.onDeviceDisconnected()
                    notifyStatus("waiting")
                }
            }
        }

        override fun onCharacteristicWriteRequest(
            device: BluetoothDevice,
            requestId: Int,
            characteristic: BluetoothGattCharacteristic,
            preparedWrite: Boolean,
            responseNeeded: Boolean,
            offset: Int,
            value: ByteArray,
        ) {
            if (characteristic.uuid != BleConstants.HEALTH_DATA_CHAR_UUID) return

            val chunk = String(value, StandardCharsets.UTF_8)
            writeBuffer.append(chunk)

            // JSON 완성 여부 확인 (단순히 '}' 로 끝나면 완료로 간주)
            val accumulated = writeBuffer.toString().trim()
            if (accumulated.endsWith("}")) {
                listener.onHealthDataReceived(accumulated)
                writeBuffer.clear()
                notifyStatus("data_received")
            }

            if (responseNeeded) {
                gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, 0, value)
            }
        }
    }

    private val advertiseCallback = object : AdvertiseCallback() {
        override fun onStartSuccess(settingsInEffect: AdvertiseSettings?) {
            Log.i(tag, "BLE advertising started")
        }

        override fun onStartFailure(errorCode: Int) {
            listener.onError("BLE 광고 시작 실패 (code=$errorCode)")
        }
    }

    fun start(): Boolean {
        if (isRunning) return true
        val bt = adapter
        if (bt == null || !bt.isEnabled) {
            listener.onError("블루투스가 꺼져 있습니다. 설정에서 켜 주세요.")
            return false
        }

        gattServer = bluetoothManager.openGattServer(context, gattCallback)
        if (gattServer == null) {
            listener.onError("GATT 서버를 열 수 없습니다.")
            return false
        }

        val service = BluetoothGattService(
            BleConstants.SERVICE_UUID,
            BluetoothGattService.SERVICE_TYPE_PRIMARY,
        )

        val healthChar = BluetoothGattCharacteristic(
            BleConstants.HEALTH_DATA_CHAR_UUID,
            BluetoothGattCharacteristic.PROPERTY_WRITE or BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE,
            BluetoothGattCharacteristic.PERMISSION_WRITE,
        )

        val statusChar = BluetoothGattCharacteristic(
            BleConstants.STATUS_CHAR_UUID,
            BluetoothGattCharacteristic.PROPERTY_READ or BluetoothGattCharacteristic.PROPERTY_NOTIFY,
            BluetoothGattCharacteristic.PERMISSION_READ,
        )
        val cccd = BluetoothGattDescriptor(
            UUID_CCCD,
            BluetoothGattCharacteristic.PERMISSION_READ or BluetoothGattCharacteristic.PERMISSION_WRITE,
        )
        statusChar.addDescriptor(cccd)
        statusCharacteristic = statusChar

        service.addCharacteristic(healthChar)
        service.addCharacteristic(statusChar)
        gattServer?.addService(service)

        advertiser = bt.bluetoothLeAdvertiser
        if (advertiser == null) {
            listener.onError("BLE 광고를 지원하지 않는 기기입니다.")
            stop()
            return false
        }

        val settings = AdvertiseSettings.Builder()
            .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
            .setConnectable(true)
            .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
            .build()

        val data = AdvertiseData.Builder()
            .setIncludeDeviceName(true)
            .addServiceUuid(ParcelUuid(BleConstants.SERVICE_UUID))
            .build()

        advertiser?.startAdvertising(settings, data, advertiseCallback)

        isRunning = true
        val qrPayload = TabletDeviceInfo.from(context).toQrPayloadJson()
        listener.onSessionStarted(qrPayload)
        return true
    }

    fun stop() {
        isRunning = false
        writeBuffer.clear()
        connectedDevice = null

        try {
            advertiser?.stopAdvertising(advertiseCallback)
        } catch (_: Exception) { /* ignore */ }
        advertiser = null

        try {
            gattServer?.close()
        } catch (_: Exception) { /* ignore */ }
        gattServer = null
        statusCharacteristic = null
    }

    fun isActive(): Boolean = isRunning

    private fun notifyStatus(status: String) {
        val char = statusCharacteristic ?: return
        val device = connectedDevice ?: return
        val bytes = status.toByteArray(StandardCharsets.UTF_8)
        char.value = bytes
        try {
            gattServer?.notifyCharacteristicChanged(device, char, false)
        } catch (e: SecurityException) {
            Log.w(tag, "notify failed: ${e.message}")
        }
    }

    companion object {
        private val UUID_CCCD: java.util.UUID =
            java.util.UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
    }
}
