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
import android.os.ParcelUuid;

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

  private static final int SCAN_TIMEOUT_SEC = 20;
  private static final int CONNECT_TIMEOUT_SEC = 15;
  private static final int CHUNK_SIZE = 180;

  private TabletBleClient() {}

  public static void send(Context context, String qrPayloadJson, String healthDataJson)
      throws Exception {
    JSONObject qr = new JSONObject(qrPayloadJson);
    if (!"cama-tablet".equals(qr.optString("app"))) {
      throw new IllegalArgumentException("Invalid tablet QR payload");
    }

    UUID serviceUuid = UUID.fromString(qr.getString("serviceUuid"));
    UUID dataCharUuid = UUID.fromString(qr.getString("dataCharUuid"));
    String preferredName = qr.optString("deviceName", null);

    BluetoothManager manager =
        (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
    if (manager == null) {
      throw new IllegalStateException("Bluetooth not supported");
    }

    BluetoothAdapter adapter = manager.getAdapter();
    if (adapter == null || !adapter.isEnabled()) {
      throw new IllegalStateException("Bluetooth is disabled");
    }

    BluetoothDevice device = scanDevice(adapter, serviceUuid, preferredName);
    if (device == null) {
      throw new IllegalStateException("Tablet not found. Keep QR screen open.");
    }

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
      int offset = 0;
      while (offset < payload.length) {
        int end = Math.min(offset + CHUNK_SIZE, payload.length);
        byte[] chunk = new byte[end - offset];
        System.arraycopy(payload, offset, chunk, 0, chunk.length);
        if (!session.writeChunk(dataChar, chunk)) {
          throw new IllegalStateException("BLE write failed");
        }
        offset = end;
      }
    } finally {
      session.gatt.close();
    }
  }

  private static BluetoothDevice scanDevice(
      BluetoothAdapter adapter, UUID serviceUuid, String preferredName) throws InterruptedException {
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
            if (preferredName != null && !preferredName.isEmpty()) {
              String name = result.getDevice().getName();
              if (name == null || !name.equals(preferredName)) {
                return;
              }
            }
            found.set(device);
            latch.countDown();
          }

          @Override
          public void onScanFailed(int errorCode) {
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
      session.gatt = device.connectGatt(context, false, session.callback, BluetoothDevice.TRANSPORT_LE);
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
    return session;
  }

  private static final class GattSession {
    BluetoothGatt gatt;
    final CountDownLatch connectLatch = new CountDownLatch(1);
    String error;
    CountDownLatch writeLatch;
    boolean writeOk;

    final BluetoothGattCallback callback =
        new BluetoothGattCallback() {
          @Override
          public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            if (newState == BluetoothProfile.STATE_CONNECTED) {
              gatt.discoverServices();
              return;
            }
            if (newState == BluetoothProfile.STATE_DISCONNECTED && connectLatch.getCount() > 0) {
              error = "Connection failed";
              connectLatch.countDown();
            }
          }

          @Override
          public void onServicesDiscovered(BluetoothGatt gatt, int status) {
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
            if (writeLatch != null) {
              writeLatch.countDown();
            }
          }
        };

    boolean writeChunk(BluetoothGattCharacteristic characteristic, byte[] chunk)
        throws InterruptedException {
      writeLatch = new CountDownLatch(1);
      writeOk = false;
      characteristic.setWriteType(BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT);
      characteristic.setValue(chunk);
      if (!gatt.writeCharacteristic(characteristic)) {
        return false;
      }
      boolean done = writeLatch.await(10, TimeUnit.SECONDS);
      return done && writeOk;
    }
  }
}
