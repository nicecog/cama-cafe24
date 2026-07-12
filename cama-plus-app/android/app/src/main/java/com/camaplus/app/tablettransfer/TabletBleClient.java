package com.camaplus.app.tablettransfer;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.ParcelUuid;
import android.util.Log;

import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

/** BLE Central — cama-tablet GATT 서버에 JSON write */
public final class TabletBleClient {

  private static final String TAG = "TabletBleClient";
  private static final int SCAN_TIMEOUT_SEC = 20;
  private static final int CONNECT_TIMEOUT_SEC = 20;
  private static final int CHUNK_SIZE_MAX = 512;
  private static final int FLUSH_DELAY_MS = 800;

  private TabletBleClient() {}

  public static void send(Context context, String qrPayloadJson, String healthDataJson)
      throws Exception {
    Log.i(TAG, "send start healthLen=" + healthDataJson.length());
    JSONObject qr = new JSONObject(qrPayloadJson);
    if (!"cama-tablet".equals(qr.optString("app"))) {
      throw new IllegalArgumentException("Invalid tablet QR payload");
    }

    UUID serviceUuid = UUID.fromString(qr.getString("serviceUuid"));
    UUID dataCharUuid = UUID.fromString(qr.getString("dataCharUuid"));

    BluetoothManager manager =
        (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
    if (manager == null) {
      throw new IllegalStateException("Bluetooth not supported");
    }

    BluetoothAdapter adapter = manager.getAdapter();
    if (adapter == null || !adapter.isEnabled()) {
      throw new IllegalStateException("Bluetooth is disabled");
    }

    BluetoothDevice device = scanDevice(adapter, serviceUuid);
    if (device == null) {
      throw new IllegalStateException("Tablet not found. Keep QR screen open.");
    }
    Log.i(TAG, "scan found device=" + device.getAddress());

    GattSession session = connectGatt(context, device);
    try {
      BluetoothGattService service = session.gatt.getService(serviceUuid);
      if (service == null) {
        throw new IllegalStateException("BLE service not found on tablet");
      }
      BluetoothGattCharacteristic dataChar = service.getCharacteristic(dataCharUuid);
      if (dataChar == null) {
        throw new IllegalStateException("BLE data characteristic not found");
      }

      byte[] payload = healthDataJson.getBytes(StandardCharsets.UTF_8);
      int chunkSize = Math.max(20, Math.min(CHUNK_SIZE_MAX, session.negotiatedMtu - 3));
      Log.i(
          TAG,
          "writing payload bytes=" + payload.length + " mtu=" + session.negotiatedMtu + " chunkSize=" + chunkSize);
      int offset = 0;
      int chunkIndex = 0;
      while (offset < payload.length) {
        int end = Math.min(offset + chunkSize, payload.length);
        byte[] chunk = new byte[end - offset];
        System.arraycopy(payload, offset, chunk, 0, chunk.length);
        if (!session.writeChunk(dataChar, chunk, chunkIndex)) {
          throw new IllegalStateException("BLE write failed at chunk " + chunkIndex);
        }
        offset = end;
        chunkIndex++;
        if (chunkSize <= 20) {
          Thread.sleep(20);
        }
      }
      int flushMs = Math.max(FLUSH_DELAY_MS, payload.length / 10);
      Log.i(TAG, "all chunks written count=" + chunkIndex + ", flushing " + flushMs + "ms...");
      Thread.sleep(flushMs);
    } finally {
      try {
        session.gatt.disconnect();
        Thread.sleep(200);
      } catch (InterruptedException ignored) {
        Thread.currentThread().interrupt();
      }
      session.gatt.close();
      Log.i(TAG, "gatt closed");
    }
  }

  private static BluetoothDevice scanDevice(BluetoothAdapter adapter, UUID serviceUuid)
      throws InterruptedException {
    BluetoothLeScanner scanner = adapter.getBluetoothLeScanner();
    if (scanner == null) {
      return null;
    }

    AtomicReference<BluetoothDevice> found = new AtomicReference<>();
    CountDownLatch latch = new CountDownLatch(1);

    ScanCallback callback =
        new ScanCallback() {
          @Override
          public void onScanResult(int callbackType, ScanResult result) {
            BluetoothDevice device = result.getDevice();
            if (device == null) {
              return;
            }
            found.set(device);
            latch.countDown();
          }

          @Override
          public void onScanFailed(int errorCode) {
            Log.e(TAG, "scan failed code=" + errorCode);
            latch.countDown();
          }
        };

    List<ScanFilter> filters = new ArrayList<>();
    filters.add(new ScanFilter.Builder().setServiceUuid(new ParcelUuid(serviceUuid)).build());

    ScanSettings settings =
        new ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build();

    scanner.startScan(filters, settings, callback);
    latch.await(SCAN_TIMEOUT_SEC, TimeUnit.SECONDS);
    scanner.stopScan(callback);
    return found.get();
  }

  private static GattSession connectGatt(Context context, BluetoothDevice device)
      throws InterruptedException {
    GattSession session = new GattSession();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      session.gatt =
          device.connectGatt(context, false, session.callback, BluetoothDevice.TRANSPORT_LE);
    } else {
      session.gatt = device.connectGatt(context, false, session.callback);
    }

    boolean ok = session.connectLatch.await(CONNECT_TIMEOUT_SEC, TimeUnit.SECONDS);
    if (!ok || session.gatt == null || session.error != null) {
      if (session.gatt != null) {
        session.gatt.close();
      }
      throw new IllegalStateException(
          session.error != null ? session.error : "Connection timeout");
    }
    Log.i(TAG, "connected mtu=" + session.negotiatedMtu);
    return session;
  }

  private static final class GattSession {
    BluetoothGatt gatt;
    final CountDownLatch connectLatch = new CountDownLatch(1);
    String error;
    CountDownLatch writeLatch;
    boolean writeOk;
    int negotiatedMtu = 23;

    final BluetoothGattCallback callback =
        new BluetoothGattCallback() {
          @Override
          public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            Log.d(TAG, "onConnectionStateChange status=" + status + " state=" + newState);
            if (newState == BluetoothProfile.STATE_CONNECTED) {
              if (status != BluetoothGatt.GATT_SUCCESS) {
                error = "Connection failed (status=" + status + ")";
                connectLatch.countDown();
                return;
              }
              if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                gatt.requestConnectionPriority(BluetoothGatt.CONNECTION_PRIORITY_HIGH);
                gatt.requestMtu(512);
                new Handler(Looper.getMainLooper())
                    .postDelayed(
                        () -> {
                          if (connectLatch.getCount() > 0) {
                            Log.w(TAG, "MTU callback timeout — discoverServices fallback");
                            gatt.discoverServices();
                          }
                        },
                        2500);
              } else {
                gatt.discoverServices();
              }
              return;
            }
            if (newState == BluetoothProfile.STATE_DISCONNECTED && connectLatch.getCount() > 0) {
              error =
                  status == BluetoothGatt.GATT_SUCCESS
                      ? "Connection failed"
                      : "Connection failed (status=" + status + ")";
              connectLatch.countDown();
            }
          }

          @Override
          public void onMtuChanged(BluetoothGatt gatt, int mtu, int status) {
            Log.d(TAG, "onMtuChanged mtu=" + mtu + " status=" + status);
            negotiatedMtu = status == BluetoothGatt.GATT_SUCCESS ? mtu : 23;
            gatt.discoverServices();
          }

          @Override
          public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            Log.d(TAG, "onServicesDiscovered status=" + status);
            if (status == BluetoothGatt.GATT_SUCCESS) {
              connectLatch.countDown();
            } else {
              error = "Service discovery failed";
              connectLatch.countDown();
            }
          }

          @Override
          public void onCharacteristicWrite(
              BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            writeOk = status == BluetoothGatt.GATT_SUCCESS;
            Log.d(TAG, "onCharacteristicWrite status=" + status + " ok=" + writeOk);
            if (writeLatch != null) {
              writeLatch.countDown();
            }
          }
        };

    boolean writeChunk(BluetoothGattCharacteristic characteristic, byte[] chunk, int index)
        throws InterruptedException {
      writeLatch = new CountDownLatch(1);
      writeOk = false;
      // WRITE_TYPE_DEFAULT: 태블릿 GATT 서버가 onCharacteristicWriteRequest + sendResponse
      characteristic.setWriteType(BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT);
      characteristic.setValue(chunk);
      Log.d(TAG, "writeChunk #" + index + " len=" + chunk.length);
      if (!gatt.writeCharacteristic(characteristic)) {
        Log.e(TAG, "writeCharacteristic returned false chunk=" + index);
        return false;
      }
      boolean done = writeLatch.await(10, TimeUnit.SECONDS);
      if (!done || !writeOk) {
        Log.e(TAG, "writeChunk timeout or fail chunk=" + index + " done=" + done + " ok=" + writeOk);
      }
      return done && writeOk;
    }
  }
}
