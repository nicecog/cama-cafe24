package com.camaplus.app.nativebridge;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;

import androidx.annotation.NonNull;

import com.camaplus.app.MainActivity;
import com.camaplus.app.healthconnect.HealthConnectHeartRateReader;
import com.camaplus.app.healthconnect.HealthConnectPermissionLauncher;
import com.camaplus.app.healthconnect.HealthConnectSettingsNavigator;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayDeque;
import java.util.Locale;
import java.util.Queue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CamaNativeBridgeModule extends ReactContextBaseJavaModule
    implements TextToSpeech.OnInitListener {

  private static final String MODULE = "CamaNativeBridge";
  private static final String NOT_IMPLEMENTED = "NOT_IMPLEMENTED";
  private static final String PERMISSION_DENIED = "PERMISSION_DENIED";
  private static final String UNAVAILABLE = "UNAVAILABLE";
  private static final String UTTERANCE_ID = "cama-tts";

  private final ExecutorService healthConnectExecutor = Executors.newSingleThreadExecutor();

  private final Handler mainHandler = new Handler(Looper.getMainLooper());
  private TextToSpeech tts;
  private boolean ttsReady = false;
  private final Queue<Runnable> pendingMainTasks = new ArrayDeque<>();

  private Promise speakPromise;
  private String lastSpokenText;
  private float lastSpeechRate = 0.9f;
  private boolean paused = false;

  public CamaNativeBridgeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    tts = new TextToSpeech(reactContext.getApplicationContext(), this);
  }

  @NonNull
  @Override
  public String getName() {
    return MODULE;
  }

  @Override
  public void onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy();
    runOnMain(
        () -> {
          if (tts != null) {
            tts.stop();
            tts.shutdown();
            tts = null;
          }
          ttsReady = false;
          resolveSpeakPromise(true);
        });
  }

  @Override
  public void onInit(int status) {
    runOnMain(
        () -> {
          if (status == TextToSpeech.SUCCESS && tts != null) {
            int langResult = tts.setLanguage(Locale.forLanguageTag("ko-KR"));
            if (langResult == TextToSpeech.LANG_MISSING_DATA
                || langResult == TextToSpeech.LANG_NOT_SUPPORTED) {
              tts.setLanguage(Locale.KOREAN);
            }

            tts.setOnUtteranceProgressListener(
                new UtteranceProgressListener() {
                  @Override
                  public void onStart(String utteranceId) {}

                  @Override
                  public void onDone(String utteranceId) {
                    runOnMain(
                        () -> {
                          paused = false;
                          resolveSpeakPromise(true);
                        });
                  }

                  @Override
                  @Deprecated
                  public void onError(String utteranceId) {
                    runOnMain(() -> rejectSpeakPromise("TTS_ERROR", "Speech synthesis failed"));
                  }

                  @Override
                  public void onError(String utteranceId, int errorCode) {
                    runOnMain(() -> rejectSpeakPromise("TTS_ERROR", "Speech synthesis failed"));
                  }
                });

            ttsReady = true;
            drainPending();
            return;
          }

          ttsReady = false;
          rejectSpeakPromise("TTS_UNAVAILABLE", "TextToSpeech init failed");
          drainPending();
        });
  }

  @ReactMethod
  public void getCapabilities(Promise promise) {
    try {
      boolean heartRateImplemented =
          HealthConnectPermissionLauncher.isHealthConnectAvailable(
              getReactApplicationContext());
      promise.resolve(buildCapabilities(heartRateImplemented));
    } catch (Exception e) {
      promise.reject("CAPABILITIES_ERROR", e.getMessage());
    }
  }

  @ReactMethod
  public void speakText(String text, double rate, Promise promise) {
    runOnMain(() -> speakTextOnMain(text, rate, promise));
  }

  @ReactMethod
  public void stopSpeech(Promise promise) {
    runOnMain(
        () -> {
          if (tts != null && tts.isSpeaking()) {
            tts.stop();
          }
          paused = false;
          resolveSpeakPromise(true);
          promise.resolve(true);
        });
  }

  @ReactMethod
  public void pauseSpeech(Promise promise) {
    runOnMain(
        () -> {
          if (tts != null && tts.isSpeaking()) {
            tts.stop();
            paused = true;
          }
          promise.resolve(true);
        });
  }

  @ReactMethod
  public void resumeSpeech(Promise promise) {
    runOnMain(
        () -> {
          if (!paused || lastSpokenText == null || lastSpokenText.isEmpty()) {
            promise.resolve(true);
            return;
          }

          speakTextOnMain(lastSpokenText, lastSpeechRate, promise);
        });
  }

  @ReactMethod
  public void capturePhoto(ReadableMap options, Promise promise) {
    rejectNotImplemented(promise);
  }

  @ReactMethod
  public void pickPhotoFromLibrary(ReadableMap options, Promise promise) {
    rejectNotImplemented(promise);
  }

  @ReactMethod
  public void getCurrentLocation(ReadableMap options, Promise promise) {
    rejectNotImplemented(promise);
  }

  @ReactMethod
  public void readVital(String vitalTypeCd, Promise promise) {
    if (!"HEART_RATE".equals(vitalTypeCd)) {
      rejectNotImplemented(promise);
      return;
    }
    readVitalSamples(vitalTypeCd, 1, promise, true);
  }

  @ReactMethod
  public void readVitalSamples(String vitalTypeCd, double daysBack, Promise promise) {
    if (!"HEART_RATE".equals(vitalTypeCd)) {
      rejectNotImplemented(promise);
      return;
    }
    readVitalSamples(vitalTypeCd, daysBack, promise, false);
  }

  private void readVitalSamples(
      String vitalTypeCd, double daysBack, Promise promise, boolean latestOnly) {
    if (!HealthConnectPermissionLauncher.isHealthConnectAvailable(getReactApplicationContext())) {
      promise.reject(UNAVAILABLE, "Health Connect is not available on this device");
      return;
    }

    Activity activity = getCurrentActivity();
    if (!(activity instanceof MainActivity)) {
      promise.reject(UNAVAILABLE, "Activity unavailable");
      return;
    }

    MainActivity mainActivity = (MainActivity) activity;
    HealthConnectPermissionLauncher permissionLauncher =
        mainActivity.getHealthConnectPermissionLauncher();

    healthConnectExecutor.execute(
        () -> {
          try {
            boolean granted =
                HealthConnectPermissionLauncher.hasHeartRateReadPermissionBlocking(
                    getReactApplicationContext());
            if (!granted) {
              runOnMain(
                  () ->
                      permissionLauncher.requestPermission(
                          ok -> {
                            if (!ok) {
                              promise.reject(PERMISSION_DENIED, "Health Connect permission denied");
                              return;
                            }
                            fetchHeartRateSamples(daysBack, latestOnly, promise);
                          }));
              return;
            }
            fetchHeartRateSamples(daysBack, latestOnly, promise);
          } catch (Exception e) {
            promise.reject("VITAL_READ_ERROR", e.getMessage());
          }
        });
  }

  private void fetchHeartRateSamples(double daysBack, boolean latestOnly, Promise promise) {
    int safeDays = (int) Math.max(1, Math.min(daysBack, 14));
    healthConnectExecutor.execute(
        () -> {
          try {
            HealthConnectHeartRateReader.ReadResult result =
                HealthConnectHeartRateReader.readHeartRateSamplesBlocking(
                    getReactApplicationContext(), safeDays);
            WritableArray samples = result.getSamples();
            if (latestOnly && samples.size() > 0) {
              promise.resolve(samples.getMap(samples.size() - 1));
              return;
            }

            WritableMap response = Arguments.createMap();
            response.putString("vitalTypeCd", "HEART_RATE");
            response.putArray("samples", samples);
            response.putInt("count", result.getCount());
            promise.resolve(response);
          } catch (Exception e) {
            promise.reject("VITAL_READ_ERROR", e.getMessage());
          }
        });
  }

  @ReactMethod
  public void openHealthConnectSettings(Promise promise) {
    Activity activity = getCurrentActivity();
    if (!(activity instanceof MainActivity)) {
      promise.reject(UNAVAILABLE, "Activity unavailable");
      return;
    }

    runOnMain(
        () -> {
          try {
            boolean opened =
                HealthConnectSettingsNavigator.openSettings((MainActivity) activity);
            if (opened) {
              promise.resolve(true);
            } else {
              promise.reject(UNAVAILABLE, "Could not open Health Connect settings");
            }
          } catch (Exception e) {
            promise.reject("HEALTH_CONNECT_SETTINGS_ERROR", e.getMessage());
          }
        });
  }

  @ReactMethod
  public void isBiometricAvailable(Promise promise) {
    rejectNotImplemented(promise);
  }

  @ReactMethod
  public void authenticateBiometric(ReadableMap options, Promise promise) {
    rejectNotImplemented(promise);
  }

  private void speakTextOnMain(String text, double rate, Promise promise) {
    if (text == null || text.trim().isEmpty()) {
      promise.reject(NOT_IMPLEMENTED, "INVALID_ARGUMENT");
      return;
    }

    Runnable task =
        () -> {
          if (tts == null) {
            promise.reject("TTS_UNAVAILABLE", "TextToSpeech is not available");
            return;
          }

          resolveSpeakPromise(true);

          lastSpokenText = text;
          lastSpeechRate = normalizeRate(rate);
          paused = false;

          tts.setSpeechRate(lastSpeechRate);
          speakPromise = promise;

          Bundle params = new Bundle();
          params.putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, UTTERANCE_ID);
          int result = tts.speak(text, TextToSpeech.QUEUE_FLUSH, params, UTTERANCE_ID);
          if (result != TextToSpeech.SUCCESS) {
            rejectSpeakPromise("TTS_ERROR", "Failed to start speech");
          }
        };

    if (!ttsReady) {
      pendingMainTasks.add(task);
      return;
    }

    task.run();
  }

  private static float normalizeRate(double rate) {
    if (rate <= 0) {
      return 0.9f;
    }
    return (float) Math.max(0.1d, Math.min(rate, 2.0d));
  }

  private void resolveSpeakPromise(boolean resolveWithTrue) {
    if (speakPromise == null) {
      return;
    }

    Promise promise = speakPromise;
    speakPromise = null;
    if (resolveWithTrue) {
      promise.resolve(true);
    }
  }

  private void rejectSpeakPromise(String code, String message) {
    if (speakPromise == null) {
      return;
    }

    Promise promise = speakPromise;
    speakPromise = null;
    promise.reject(code, message);
  }

  private void drainPending() {
    while (!pendingMainTasks.isEmpty()) {
      Runnable task = pendingMainTasks.poll();
      if (task != null) {
        task.run();
      }
    }
  }

  private void runOnMain(Runnable runnable) {
    if (Looper.myLooper() == Looper.getMainLooper()) {
      runnable.run();
      return;
    }
    mainHandler.post(runnable);
  }

  private static void rejectNotImplemented(Promise promise) {
    promise.reject(NOT_IMPLEMENTED, "Native bridge stub — implementation pending");
  }

  /** @param implemented true when native SDK wiring is complete */
  static WritableMap buildCapabilities(boolean implemented) {
    WritableMap root = Arguments.createMap();
    root.putString("platform", "android");

    root.putMap("camera", capability(true, implemented, "android.permission.CAMERA"));
    root.putMap(
        "photoLibrary",
        capability(true, implemented, "android.permission.READ_MEDIA_IMAGES"));
    root.putMap(
        "location",
        capability(true, implemented, "android.permission.ACCESS_FINE_LOCATION"));
    root.putMap(
        "biometrics",
        capability(true, implemented, "android.permission.USE_BIOMETRIC"));
    root.putMap("stepCounter", capability(true, true, "android.permission.ACTIVITY_RECOGNITION"));

    WritableMap vitals = Arguments.createMap();
    vitals.putMap("HEART_RATE", capability(true, implemented, "android.permission.health.READ_HEART_RATE"));
    vitals.putMap("SPO2", capability(true, implemented));
    vitals.putMap("BP_SYSTOLIC", capability(true, implemented));
    vitals.putMap("BP_DIASTOLIC", capability(true, implemented));
    vitals.putMap("BODY_TEMP", capability(true, implemented));
    vitals.putMap("RESPIRATORY_RATE", capability(true, implemented));
    root.putMap("vitals", vitals);

    return root;
  }

  private static WritableMap capability(
      boolean available, boolean implemented, String... permissions) {
    WritableMap map = Arguments.createMap();
    map.putBoolean("available", available);
    map.putBoolean("implemented", implemented);
    if (permissions.length > 0) {
      map.putArray("permissionRequired", Arguments.fromArray(permissions));
    }
    return map;
  }
}
