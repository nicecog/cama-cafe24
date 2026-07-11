package com.camaplus.app.tablettransfer;

import android.app.Activity;
import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TabletTransferModule extends ReactContextBaseJavaModule
    implements ActivityEventListener {

  private static final String MODULE = "CamaTabletTransfer";
  private static final int REQUEST_QR = 9101;

  private final ExecutorService executor = Executors.newSingleThreadExecutor();
  private Promise scanPromise;

  public TabletTransferModule(ReactApplicationContext reactContext) {
    super(reactContext);
    reactContext.addActivityEventListener(this);
  }

  @NonNull
  @Override
  public String getName() {
    return MODULE;
  }

  @ReactMethod
  public void scanTabletQr(Promise promise) {
    Activity activity = getCurrentActivity();
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Activity not available");
      return;
    }

    scanPromise = promise;
    UiThreadUtil.runOnUiThread(
        () -> {
          Intent intent = new Intent(activity, QrScanActivity.class);
          activity.startActivityForResult(intent, REQUEST_QR);
        });
  }

  @ReactMethod
  public void sendHealthDataToTablet(
      String qrPayloadJson, String healthDataJson, Promise promise) {
    executor.execute(
        () -> {
          try {
            TabletBleClient.send(
                getReactApplicationContext(), qrPayloadJson, healthDataJson);
            promise.resolve(true);
          } catch (Exception e) {
            promise.reject("BLE_ERROR", e.getMessage() != null ? e.getMessage() : "BLE failed");
          }
        });
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    if (requestCode != REQUEST_QR || scanPromise == null) {
      return;
    }

    Promise promise = scanPromise;
    scanPromise = null;

    if (resultCode == Activity.RESULT_OK && data != null) {
      String raw = data.getStringExtra(QrScanActivity.EXTRA_QR_RAW);
      if (raw != null && !raw.isEmpty()) {
        promise.resolve(raw);
        return;
      }
    }

    promise.reject("CANCELLED", "QR scan cancelled");
  }

  @Override
  public void onNewIntent(Intent intent) {}
}
