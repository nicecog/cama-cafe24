package com.camaplus.app.stepcounter;

import android.content.Context;
import android.content.SharedPreferences;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class CamaStepCounterModule extends ReactContextBaseJavaModule
    implements SensorEventListener {

  private static final String PREFS = "cama_step_counter";
  private static final String KEY_DATE = "baseline_date";
  private static final String KEY_BASELINE = "baseline_raw";

  private final ReactApplicationContext reactContext;
  private SensorManager sensorManager;
  private Sensor stepSensor;
  private Promise pendingPromise;
  private float latestRawSteps = -1f;

  public CamaStepCounterModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @NonNull
  @Override
  public String getName() {
    return "CamaStepCounter";
  }

  @ReactMethod
  public void getTodayStepCount(Promise promise) {
    sensorManager = (SensorManager) reactContext.getSystemService(Context.SENSOR_SERVICE);
    if (sensorManager == null) {
      promise.reject("NO_SENSOR_MANAGER", "SensorManager unavailable");
      return;
    }

    stepSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
    if (stepSensor == null) {
      promise.reject("NO_STEP_SENSOR", "TYPE_STEP_COUNTER not supported on this device");
      return;
    }

    pendingPromise = promise;
    latestRawSteps = -1f;
    boolean registered =
        sensorManager.registerListener(this, stepSensor, SensorManager.SENSOR_DELAY_NORMAL);
    if (!registered) {
      pendingPromise = null;
      promise.reject("SENSOR_REGISTER_FAILED", "Could not register step counter listener");
    }
  }

  @Override
  public void onSensorChanged(SensorEvent event) {
    if (event.sensor.getType() != Sensor.TYPE_STEP_COUNTER || pendingPromise == null) {
      return;
    }

    latestRawSteps = event.values[0];
    sensorManager.unregisterListener(this);

    try {
      int todaySteps = resolveTodaySteps(latestRawSteps);
      pendingPromise.resolve(todaySteps);
    } catch (Exception e) {
      pendingPromise.reject("STEP_READ_ERROR", e.getMessage());
    } finally {
      pendingPromise = null;
    }
  }

  @Override
  public void onAccuracyChanged(Sensor sensor, int accuracy) {
    // no-op
  }

  private int resolveTodaySteps(float rawSteps) {
    SharedPreferences prefs =
        reactContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    String today = todayKey();
    String savedDate = prefs.getString(KEY_DATE, "");
    float baseline = prefs.getFloat(KEY_BASELINE, rawSteps);

    if (!today.equals(savedDate)) {
      baseline = rawSteps;
      prefs.edit().putString(KEY_DATE, today).putFloat(KEY_BASELINE, baseline).apply();
    }

    int delta = Math.round(rawSteps - baseline);
    if (delta < 0) {
      baseline = rawSteps;
      prefs.edit().putFloat(KEY_BASELINE, baseline).apply();
      delta = 0;
    }

    return delta;
  }

  private static String todayKey() {
    SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
    fmt.setTimeZone(TimeZone.getDefault());
    return fmt.format(new Date());
  }
}
