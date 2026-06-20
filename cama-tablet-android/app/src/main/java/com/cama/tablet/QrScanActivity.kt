package com.cama.tablet

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Button
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import java.util.concurrent.Executors

class QrScanActivity : AppCompatActivity() {

    private var handled = false
    private val cameraExecutor = Executors.newSingleThreadExecutor()

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        if (granted) bindCamera() else finish()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_qr_scan)

        findViewById<Button>(R.id.btnCancel).setOnClickListener { finish() }

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
            == PackageManager.PERMISSION_GRANTED
        ) {
            bindCamera()
        } else {
            permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    private fun bindCamera() {
        val previewView = findViewById<PreviewView>(R.id.previewView)
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)

        cameraProviderFuture.addListener({
            val cameraProvider = cameraProviderFuture.get()
            val preview = Preview.Builder().build().also {
                it.setSurfaceProvider(previewView.surfaceProvider)
            }

            val scanner = BarcodeScanning.getClient()
            val analysis = ImageAnalysis.Builder()
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                .build()

            analysis.setAnalyzer(cameraExecutor) { imageProxy ->
                if (handled) {
                    imageProxy.close()
                    return@setAnalyzer
                }
                val mediaImage = imageProxy.image
                if (mediaImage == null) {
                    imageProxy.close()
                    return@setAnalyzer
                }
                val image = InputImage.fromMediaImage(
                    mediaImage,
                    imageProxy.imageInfo.rotationDegrees,
                )
                scanner.process(image)
                    .addOnSuccessListener { barcodes ->
                        val raw = barcodes.firstOrNull { it.format == Barcode.FORMAT_QR_CODE }?.rawValue
                        if (!raw.isNullOrBlank() && !handled) {
                            handled = true
                            runOnUiThread { deliverResult(raw) }
                        }
                    }
                    .addOnCompleteListener { imageProxy.close() }
            }

            cameraProvider.unbindAll()
            cameraProvider.bindToLifecycle(
                this,
                CameraSelector.DEFAULT_BACK_CAMERA,
                preview,
                analysis,
            )
        }, ContextCompat.getMainExecutor(this))
    }

    private fun deliverResult(payload: String) {
        setResult(
            RESULT_OK,
            Intent().putExtra(EXTRA_QR_PAYLOAD, payload),
        )
        finish()
    }

    override fun onDestroy() {
        cameraExecutor.shutdown()
        super.onDestroy()
    }

    companion object {
        const val EXTRA_QR_PAYLOAD = "qr_payload"
    }
}
