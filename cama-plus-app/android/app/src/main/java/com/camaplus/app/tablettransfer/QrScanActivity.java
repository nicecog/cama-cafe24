package com.camaplus.app.tablettransfer;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

/** CAMA Tablet QR 스캔 (ZXing) */
public class QrScanActivity extends AppCompatActivity {

  public static final String EXTRA_QR_RAW = "qr_raw";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    IntentIntegrator integrator = new IntentIntegrator(this);
    integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE);
    integrator.setPrompt("CAMA Tablet QR 코드를 스캔하세요");
    integrator.setBeepEnabled(false);
    integrator.setOrientationLocked(false);
    integrator.initiateScan();
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
    if (result != null && result.getContents() != null && !result.getContents().isEmpty()) {
      Intent out = new Intent();
      out.putExtra(EXTRA_QR_RAW, result.getContents());
      setResult(RESULT_OK, out);
    } else {
      setResult(RESULT_CANCELED);
    }
    finish();
  }
}
