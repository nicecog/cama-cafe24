package com.cama.tablet

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONObject

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    private val qrScanLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult(),
    ) { result ->
        if (result.resultCode != RESULT_OK) return@registerForActivityResult
        val payload = result.data?.getStringExtra(QrScanActivity.EXTRA_QR_PAYLOAD)
        if (payload.isNullOrBlank()) {
            injectScanResult(ok = false, payload = "", error = "empty")
            return@registerForActivityResult
        }
        injectScanResult(ok = true, payload = payload, error = null)
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        webView = findViewById(R.id.webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            mediaPlaybackRequiresUserGesture = false
        }
        webView.webChromeClient = WebChromeClient()
        webView.webViewClient = WebViewClient()

        val bridge = WebAppBridge { startQrScan() }
        webView.addJavascriptInterface(bridge, "AndroidBridge")
        webView.addJavascriptInterface(bridge, "CamaTabletBridge")

        webView.loadUrl(BuildConfig.TABLET_WEB_URL)
    }

    private fun startQrScan() {
        qrScanLauncher.launch(Intent(this, QrScanActivity::class.java))
    }

    private fun injectScanResult(ok: Boolean, payload: String, error: String?) {
        val json = JSONObject()
        json.put("type", "scanResult")
        json.put("ok", ok)
        json.put("payload", payload)
        if (error != null) json.put("error", error)
        val script = "(function(){window.dispatchEvent(new CustomEvent('cama-tablet-native',{detail:${json}}));})();"
        webView.post {
            webView.evaluateJavascript(script, null)
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }
}
