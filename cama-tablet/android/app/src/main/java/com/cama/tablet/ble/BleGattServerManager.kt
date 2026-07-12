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
import com.cama.tablet.CamaTabletLog
import java.io.ByteArrayOutputStream
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
    private var pendingAdvertise = false
    private var healthService: BluetoothGattService? = null

    private val mainHandler = android.os.Handler(android.os.Looper.getMainLooper())

    private val writeBuffer = ByteArrayOutputStream()

    private fun resetWriteBuffer() {
        writeBuffer.reset()
    }

    private val gattCallback = object : BluetoothGattServerCallback() {
        override fun onConnectionStateChange(device: BluetoothDevice, status: Int, newState: Int) {
            CamaTabletLog.ble(
                "onConnectionStateChange status=$status newState=$newState device=${device.address}",
            )
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
                    val pendingBytes = writeBuffer.size()
                    if (pendingBytes > 0) {
                        CamaTabletLog.w("[BLE] disconnected with pending bytes=$pendingBytes")
                        if (!tryCompleteWrite()) {
                            listener.onError(
                                "데이터 수신 불완전 ($pendingBytes bytes). QR 화면 유지 후 다시 전송해 주세요.",
                            )
                        }
                    }
                    connectedDevice = null
                    resetWriteBuffer()
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
            if (characteristic.uuid != BleConstants.HEALTH_DATA_CHAR_UUID) {
                CamaTabletLog.w("[BLE] write to unknown char ${characteristic.uuid}")
                return
            }

            // 바이트 단위 누적 — 청크마다 UTF-8 String 변환 시 한글 멀티바이트가 깨짐
            CamaTabletLog.ble(
                "onWrite offset=$offset len=${value.size} responseNeeded=$responseNeeded " +
                    "preparedWrite=$preparedWrite bufferBefore=${writeBuffer.size()}",
            )
            writeBuffer.write(value)
            CamaTabletLog.ble("bufferAfter=${writeBuffer.size()}")
            tryCompleteWrite()

            if (responseNeeded) {
                val sent = gattServer?.sendResponse(
                    device, requestId, BluetoothGatt.GATT_SUCCESS, 0, value,
                )
                CamaTabletLog.ble("sendResponse requestId=$requestId sent=$sent")
            }
        }
    }

    private val advertiseCallback = object : AdvertiseCallback() {
        override fun onStartSuccess(settingsInEffect: AdvertiseSettings?) {
            Log.i(tag, "BLE advertising started")
            CamaTabletLog.ble("advertising started")
            pendingAdvertise = false
        }

        override fun onStartFailure(errorCode: Int) {
            pendingAdvertise = false
            val reason = when (errorCode) {
                ADVERTISE_FAILED_DATA_TOO_LARGE -> "광고 데이터가 너무 큽니다"
                ADVERTISE_FAILED_TOO_MANY_ADVERTISERS -> "BLE 광고 슬롯이 가득 찼습니다"
                ADVERTISE_FAILED_ALREADY_STARTED -> "BLE 광고가 이미 실행 중입니다"
                ADVERTISE_FAILED_INTERNAL_ERROR -> "BLE 내부 오류"
                ADVERTISE_FAILED_FEATURE_UNSUPPORTED -> "BLE 광고 미지원"
                else -> "code=$errorCode"
            }
            Log.e(tag, "BLE advertising failed: $reason")
            listener.onError("BLE 광고 시작 실패 ($reason)")
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
        healthService = service
        gattServer?.addService(service)

        advertiser = bt.bluetoothLeAdvertiser
        if (advertiser == null) {
            listener.onError("BLE 광고를 지원하지 않는 기기입니다.")
            stop()
            return false
        }

        // addService()는 비동기 — 서비스 등록 완료 후 광고 시작
        pendingAdvertise = true
        mainHandler.postDelayed({ startAdvertisingIfReady() }, 300)

        isRunning = true
        val qrPayload = TabletDeviceInfo.from(context).toQrPayloadJson()
        listener.onSessionStarted(qrPayload)
        return true
    }

    private fun startAdvertisingIfReady() {
        if (!isRunning || !pendingAdvertise) return

        val service = healthService
        val adv = advertiser
        if (service == null || adv == null) {
            listener.onError("BLE 광고를 시작할 수 없습니다.")
            return
        }

        val settings = AdvertiseSettings.Builder()
            .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
            .setConnectable(true)
            .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
            .build()

        // 기기명(Galaxy Tab A …) + 128bit UUID 합치면 31byte 초과 → DATA_TOO_LARGE
        // 폰 앱은 serviceUuid 필터로 스캔하므로 광고 패킷에 기기명 포함하지 않음
        val data = AdvertiseData.Builder()
            .setIncludeDeviceName(false)
            .addServiceUuid(ParcelUuid(BleConstants.SERVICE_UUID))
            .build()

        try {
            adv.startAdvertising(settings, data, advertiseCallback)
        } catch (e: SecurityException) {
            pendingAdvertise = false
            Log.e(tag, "startAdvertising SecurityException", e)
            listener.onError("블루투스 권한이 필요합니다.")
        }
    }

    fun stop() {
        isRunning = false
        pendingAdvertise = false
        resetWriteBuffer()
        connectedDevice = null
        healthService = null
        mainHandler.removeCallbacksAndMessages(null)

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

    /** @return true if complete JSON was delivered to listener */
    private fun tryCompleteWrite(): Boolean {
        val bytes = writeBuffer.toByteArray()
        if (bytes.isEmpty()) return false
        val accumulated = String(bytes, StandardCharsets.UTF_8).trim()
        if (accumulated.isEmpty()) return false
        return try {
            org.json.JSONObject(accumulated)
            CamaTabletLog.ble("JSON complete bytes=${bytes.size} chars=${accumulated.length}")
            Log.i(tag, "Health data received (${bytes.size} bytes)")
            listener.onHealthDataReceived(accumulated)
            resetWriteBuffer()
            notifyStatus("data_received")
            true
        } catch (e: org.json.JSONException) {
            CamaTabletLog.d(
                "[BLE] JSON incomplete bytes=${bytes.size} chars=${accumulated.length}: ${e.message}",
            )
            false
        }
    }

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
