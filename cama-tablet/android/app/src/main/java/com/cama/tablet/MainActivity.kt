package com.cama.tablet

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.cama.tablet.ble.BleGattServerManager
import com.cama.tablet.ble.TabletDeviceInfo
import org.json.JSONObject

class MainActivity : AppCompatActivity(), BleGattServerManager.Listener {

    private lateinit var webView: WebView
    private lateinit var emitter: NativeEventEmitter
    private var bleManager: BleGattServerManager? = null

    private val blePermissions = buildList {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            add(Manifest.permission.BLUETOOTH_CONNECT)
            add(Manifest.permission.BLUETOOTH_ADVERTISE)
        } else {
            add(Manifest.permission.ACCESS_FINE_LOCATION)
        }
    }.toTypedArray()

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions(),
    ) { results ->
        val denied = results.filterValues { !it }.keys
        if (denied.isNotEmpty()) {
            emitter.emitError("블루투스 권한이 필요합니다: ${denied.joinToString()}")
            return@registerForActivityResult
        }
        startBleSessionInternal()
    }

    private val enableBluetoothLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult(),
    ) {
        if (BluetoothAdapter.getDefaultAdapter()?.isEnabled == true) {
            requestBlePermissionsAndStart()
        } else {
            emitter.emitError("블루투스를 켜야 QR 연결을 시작할 수 있습니다.")
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        webView = findViewById(R.id.webView)

        emitter = NativeEventEmitter { webView }
        bleManager = BleGattServerManager(this, this)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false
        }
        webView.webChromeClient = WebChromeClient()
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // 브릿지 준비 완료 신호
                emitter.emit("bridgeReady", ok = true)
            }
        }

        val bridge = WebAppBridge(
            onGenerateQr = { requestBlePermissionsAndStart() },
            onStopBle = { stopBleSession() },
            onGetCapabilities = { buildCapabilities() },
        )
        webView.addJavascriptInterface(bridge, "AndroidBridge")
        webView.addJavascriptInterface(bridge, "CamaTabletBridge")

        // 오프라인: APK assets에 번들된 웹앱 로드
        webView.loadUrl("file:///android_asset/www/index.html")
    }

    private fun buildCapabilities(): JSONObject {
        val caps = JSONObject()
        caps.put("offline", true)
        caps.put("blePeripheral", true)
        caps.put("qrGenerate", true)
        caps.put("bridgeVersion", 1)
        caps.put("deviceInfo", JSONObject(TabletDeviceInfo.from(this).toQrPayloadJson()))
        return caps
    }

    private fun requestBlePermissionsAndStart() {
        val missing = blePermissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (missing.isNotEmpty()) {
            permissionLauncher.launch(missing.toTypedArray())
            return
        }
        startBleSessionInternal()
    }

    private fun startBleSessionInternal() {
        val adapter = BluetoothAdapter.getDefaultAdapter()
        if (adapter == null) {
            emitter.emitError("이 기기는 블루투스를 지원하지 않습니다.")
            return
        }
        if (!adapter.isEnabled) {
            enableBluetoothLauncher.launch(Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE))
            return
        }

        val started = bleManager?.start() ?: false
        if (!started) {
            Toast.makeText(this, "BLE 세션 시작 실패", Toast.LENGTH_SHORT).show()
        }
    }

    private fun stopBleSession() {
        bleManager?.stop()
        emitter.emit("bleSessionStopped", ok = true)
    }

    // --- BleGattServerManager.Listener ---

    override fun onSessionStarted(qrPayload: String) {
        emitter.emitQrStarted(qrPayload)
    }

    override fun onDeviceConnected(deviceName: String?) {
        emitter.emitConnected(deviceName)
    }

    override fun onDeviceDisconnected() {
        emitter.emitDisconnected()
    }

    override fun onHealthDataReceived(json: String) {
        emitter.emitHealthData(json)
    }

    override fun onError(message: String) {
        emitter.emitError(message)
    }

    override fun onDestroy() {
        bleManager?.stop()
        super.onDestroy()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
