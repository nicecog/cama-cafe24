package com.camaplus.app.nativebridge;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.camaplus.app.BuildConfig;
import com.camaplus.app.MainActivity;
import com.camaplus.app.healthconnect.HealthConnectHeartRateReader;
import com.camaplus.app.healthconnect.HealthConnectPermissionLauncher;
import com.camaplus.app.healthconnect.HealthConnectSettingsNavigator;
import com.camaplus.app.nativebridge.foodvision.FoodCatalog;
import com.camaplus.app.nativebridge.foodvision.FoodDetection;
import com.camaplus.app.nativebridge.foodvision.FoodPhotoCapture;
import com.camaplus.app.nativebridge.foodvision.FoodVisionAggregator;
import com.camaplus.app.nativebridge.foodvision.FoodVisionDecoder;
import com.camaplus.app.nativebridge.foodvision.FoodVisionEngine;
import com.camaplus.app.nativebridge.foodvision.FoodVisionProfile;
import com.camaplus.app.speech.SpeechRecognitionHelper;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayDeque;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Queue;
import java.util.TimeZone;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CamaNativeBridgeModule extends ReactContextBaseJavaModule
    implements TextToSpeech.OnInitListener, ActivityEventListener {

  private static final String MODULE = "CamaNativeBridge";
  private static final String TAG = "CamaNativeBridge";
  private static final String NOT_IMPLEMENTED = "NOT_IMPLEMENTED";
  private static final String PERMISSION_DENIED = "PERMISSION_DENIED";
  private static final String UNAVAILABLE = "UNAVAILABLE";
  private static final String CANCELLED = "CANCELLED";
  private static final String UTTERANCE_ID = "cama-tts";
  private static final String SPEECH_RECOGNITION_EVENT = "CamaSpeechRecognition";

  private static final int REQUEST_FOOD_CAMERA = 9201;
  private static final int REQUEST_FOOD_LIBRARY = 9202;
  private static final int REQUEST_CAPTURE_CAMERA = 9203;
  private static final int REQUEST_CAPTURE_LIBRARY = 9204;

  private static final int DEFAULT_MAX_ITEMS = 8;

  private final ExecutorService healthConnectExecutor = Executors.newSingleThreadExecutor();
  private final ExecutorService foodVisionExecutor = Executors.newSingleThreadExecutor();

  private final Handler mainHandler = new Handler(Looper.getMainLooper());
  private TextToSpeech tts;
  private boolean ttsReady = false;
  private final Queue<Runnable> pendingMainTasks = new ArrayDeque<>();

  private Promise speakPromise;
  private String lastSpokenText;
  private float lastSpeechRate = 0.9f;
  private boolean paused = false;

  private SpeechRecognitionHelper speechRecognitionHelper;

  private FoodVisionEngine foodVisionEngine;
  private Promise pendingFoodPromise;
  private File pendingCameraFile;
  private PendingFoodOptions pendingFoodOptions;

  public CamaNativeBridgeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    reactContext.addActivityEventListener(this);
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
    getReactApplicationContext().removeActivityEventListener(this);
    foodVisionExecutor.execute(
        () -> {
          if (foodVisionEngine != null) {
            foodVisionEngine.close();
            foodVisionEngine = null;
          }
        });
    foodVisionExecutor.shutdown();
    rejectPendingFood(CANCELLED, "Bridge destroyed");
    runOnMain(
        () -> {
          if (speechRecognitionHelper != null) {
            speechRecognitionHelper.destroy();
            speechRecognitionHelper = null;
          }
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
    launchPhotoCapture(REQUEST_CAPTURE_CAMERA, promise);
  }

  @ReactMethod
  public void pickPhotoFromLibrary(ReadableMap options, Promise promise) {
    launchPhotoCapture(REQUEST_CAPTURE_LIBRARY, promise);
  }

  /**
   * 촬영(또는 앨범 선택) → 온디바이스 추론 → 클래스 집계까지 한 번에 수행한다.
   * 원본 이미지는 네이티브 임시 파일로만 존재하며 JS·서버로 전달되지 않는다.
   */
  @ReactMethod
  public void analyzeFoodImage(ReadableMap options, Promise promise) {
    if (pendingFoodPromise != null) {
      promise.reject(UNAVAILABLE, "Food analysis already in progress");
      return;
    }

    Activity activity = getCurrentActivity();
    if (activity == null) {
      promise.reject(UNAVAILABLE, "Activity unavailable");
      return;
    }

    PendingFoodOptions parsed = PendingFoodOptions.from(options);
    if ("library".equals(parsed.source)) {
      pendingFoodPromise = promise;
      pendingFoodOptions = parsed;
      pendingCameraFile = null;
      UiThreadUtil.runOnUiThread(
          () -> {
            try {
              activity.startActivityForResult(
                  FoodPhotoCapture.libraryIntent(), REQUEST_FOOD_LIBRARY);
            } catch (Exception e) {
              rejectPendingFood(UNAVAILABLE, e.getMessage());
            }
          });
      return;
    }

    if (ContextCompat.checkSelfPermission(
            getReactApplicationContext(), Manifest.permission.CAMERA)
        != PackageManager.PERMISSION_GRANTED) {
      promise.reject(PERMISSION_DENIED, "CAMERA permission denied");
      return;
    }

    try {
      File tempFile = FoodPhotoCapture.createTempFile(getReactApplicationContext());
      Uri contentUri = FoodPhotoCapture.toContentUri(getReactApplicationContext(), tempFile);
      Intent intent = FoodPhotoCapture.cameraIntent(contentUri);
      grantCameraUriPermissions(intent, contentUri);

      pendingFoodPromise = promise;
      pendingFoodOptions = parsed;
      pendingCameraFile = tempFile;

      UiThreadUtil.runOnUiThread(
          () -> {
            try {
              activity.startActivityForResult(intent, REQUEST_FOOD_CAMERA);
            } catch (Exception e) {
              FoodPhotoCapture.deleteQuietly(tempFile);
              rejectPendingFood(UNAVAILABLE, e.getMessage());
            }
          });
    } catch (Exception e) {
      promise.reject(UNAVAILABLE, e.getMessage());
    }
  }

  @ReactMethod
  public void getFoodVisionInfo(Promise promise) {
    foodVisionExecutor.execute(
        () -> {
          try {
            FoodVisionEngine.Info info = ensureFoodVisionEngine().info(BuildConfig.VERSION_NAME);
            WritableMap map = Arguments.createMap();
            map.putString("modelVersion", info.modelVersion);
            map.putString("catalogVersion", info.catalogVersion);
            map.putString("profile", info.profile);
            map.putInt("classCount", info.classCount);
            promise.resolve(map);
          } catch (Exception e) {
            Log.e(TAG, "getFoodVisionInfo failed", e);
            promise.reject(UNAVAILABLE, e.getMessage());
          }
        });
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    if (requestCode == REQUEST_FOOD_CAMERA || requestCode == REQUEST_FOOD_LIBRARY) {
      handleFoodAnalysisResult(requestCode, resultCode, data);
      return;
    }
    if (requestCode == REQUEST_CAPTURE_CAMERA || requestCode == REQUEST_CAPTURE_LIBRARY) {
      handleStandaloneCaptureResult(requestCode, resultCode, data);
    }
  }

  @Override
  public void onNewIntent(Intent intent) {}

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
  public void checkSpeechRecognitionAvailable(Promise promise) {
    try {
      boolean available =
          SpeechRecognitionHelper.isRecognitionAvailable(getReactApplicationContext());
      WritableMap map = Arguments.createMap();
      map.putBoolean("available", available);
      map.putBoolean("implemented", true);
      promise.resolve(map);
    } catch (Exception e) {
      promise.reject("SPEECH_CHECK_ERROR", e.getMessage());
    }
  }

  @ReactMethod
  public void startSpeechRecognition(ReadableMap options, Promise promise) {
    ReactApplicationContext context = getReactApplicationContext();
    if (ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO)
        != PackageManager.PERMISSION_GRANTED) {
      promise.reject(PERMISSION_DENIED, "RECORD_AUDIO permission denied");
      return;
    }
    if (!SpeechRecognitionHelper.isRecognitionAvailable(context)) {
      promise.reject(UNAVAILABLE, "Speech recognition is not available on this device");
      return;
    }

    final String locale =
        options != null && options.hasKey("locale") ? options.getString("locale") : "ko-KR";
    final boolean partialResults =
        options == null || !options.hasKey("partialResults") || options.getBoolean("partialResults");
    final String prompt =
        options != null && options.hasKey("prompt") ? options.getString("prompt") : "말씀해 주세요";
    final int maxDurationMs =
        options != null && options.hasKey("maxDurationMs")
            ? (int) options.getDouble("maxDurationMs")
            : 60_000;

    runOnMain(
        () -> {
          try {
            if (speechRecognitionHelper != null) {
              speechRecognitionHelper.destroy();
              speechRecognitionHelper = null;
            }
            speechRecognitionHelper =
                new SpeechRecognitionHelper(
                    context,
                    new SpeechRecognitionHelper.Listener() {
                      @Override
                      public void onStarted() {
                        emitSpeechRecognitionEvent("started", null, null, null);
                      }

                      @Override
                      public void onPartial(String transcript) {
                        emitSpeechRecognitionEvent("partial", transcript, null, null);
                      }

                      @Override
                      public void onFinal(String transcript) {
                        emitSpeechRecognitionEvent("final", transcript, null, null);
                      }

                      @Override
                      public void onEnded() {
                        emitSpeechRecognitionEvent("ended", null, null, null);
                        speechRecognitionHelper = null;
                      }

                      @Override
                      public void onError(String code, String message) {
                        emitSpeechRecognitionEvent("error", null, code, message);
                      }
                    });
            speechRecognitionHelper.start(locale, partialResults, prompt, maxDurationMs);
            promise.resolve(true);
          } catch (Exception e) {
            promise.reject("SPEECH_START_ERROR", e.getMessage());
          }
        });
  }

  @ReactMethod
  public void stopSpeechRecognition(Promise promise) {
    runOnMain(
        () -> {
          try {
            if (speechRecognitionHelper != null) {
              speechRecognitionHelper.stop();
            }
            promise.resolve(true);
          } catch (Exception e) {
            promise.reject("SPEECH_STOP_ERROR", e.getMessage());
          }
        });
  }

  @ReactMethod
  public void cancelSpeechRecognition(Promise promise) {
    runOnMain(
        () -> {
          try {
            if (speechRecognitionHelper != null) {
              speechRecognitionHelper.cancel();
              speechRecognitionHelper = null;
            }
            promise.resolve(true);
          } catch (Exception e) {
            promise.reject("SPEECH_CANCEL_ERROR", e.getMessage());
          }
        });
  }

  private void emitSpeechRecognitionEvent(
      String event, String transcript, String errorCode, String errorMessage) {
    WritableMap map = Arguments.createMap();
    map.putString("event", event);
    if (transcript != null) {
      map.putString("transcript", transcript);
    }
    if (errorCode != null) {
      map.putString("error", errorCode);
    }
    if (errorMessage != null) {
      map.putString("message", errorMessage);
    }
    try {
      getReactApplicationContext()
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(SPEECH_RECOGNITION_EVENT, map);
    } catch (Exception ignored) {
      // bridge may already be torn down
    }
  }

  @ReactMethod
  public void isBiometricAvailable(Promise promise) {
    try {
      promise.resolve(BiometricBridgeHelper.availability(getReactApplicationContext()));
    } catch (Exception e) {
      promise.reject("UNAVAILABLE", e.getMessage(), e);
    }
  }

  @ReactMethod
  public void authenticateBiometric(ReadableMap options, Promise promise) {
    FragmentActivity activity = asFragmentActivity();
    BiometricBridgeHelper.authenticateForPromise(activity, options, promise);
  }

  @ReactMethod
  public void storeBiometricSecret(String secret, Promise promise) {
    BiometricBridgeHelper.storeSecret(getReactApplicationContext(), secret, promise);
  }

  @ReactMethod
  public void getBiometricSecret(Promise promise) {
    BiometricBridgeHelper.getSecret(
        asFragmentActivity(), getReactApplicationContext(), promise);
  }

  @ReactMethod
  public void clearBiometricSecret(Promise promise) {
    BiometricBridgeHelper.clearSecret(getReactApplicationContext(), promise);
  }

  @ReactMethod
  public void hasBiometricSecret(Promise promise) {
    BiometricBridgeHelper.hasSecret(getReactApplicationContext(), promise);
  }

  @ReactMethod
  public void getDeviceId(Promise promise) {
    BiometricBridgeHelper.getDeviceId(getReactApplicationContext(), promise);
  }

  private FragmentActivity asFragmentActivity() {
    android.app.Activity activity = getCurrentActivity();
    if (activity instanceof FragmentActivity) {
      return (FragmentActivity) activity;
    }
    return null;
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

  private void launchPhotoCapture(int requestCode, Promise promise) {
    if (pendingFoodPromise != null) {
      promise.reject(UNAVAILABLE, "Photo capture already in progress");
      return;
    }

    Activity activity = getCurrentActivity();
    if (activity == null) {
      promise.reject(UNAVAILABLE, "Activity unavailable");
      return;
    }

    if (requestCode == REQUEST_CAPTURE_CAMERA) {
      if (ContextCompat.checkSelfPermission(
              getReactApplicationContext(), Manifest.permission.CAMERA)
          != PackageManager.PERMISSION_GRANTED) {
        promise.reject(PERMISSION_DENIED, "CAMERA permission denied");
        return;
      }
      try {
        File tempFile = FoodPhotoCapture.createTempFile(getReactApplicationContext());
        Uri contentUri = FoodPhotoCapture.toContentUri(getReactApplicationContext(), tempFile);
        Intent intent = FoodPhotoCapture.cameraIntent(contentUri);
        grantCameraUriPermissions(intent, contentUri);
        pendingFoodPromise = promise;
        pendingCameraFile = tempFile;
        pendingFoodOptions = null;
        UiThreadUtil.runOnUiThread(
            () -> {
              try {
                activity.startActivityForResult(intent, requestCode);
              } catch (Exception e) {
                FoodPhotoCapture.deleteQuietly(tempFile);
                rejectPendingFood(UNAVAILABLE, e.getMessage());
              }
            });
      } catch (Exception e) {
        promise.reject(UNAVAILABLE, e.getMessage());
      }
      return;
    }

    pendingFoodPromise = promise;
    pendingCameraFile = null;
    pendingFoodOptions = null;
    UiThreadUtil.runOnUiThread(
        () -> {
          try {
            activity.startActivityForResult(FoodPhotoCapture.libraryIntent(), requestCode);
          } catch (Exception e) {
            rejectPendingFood(UNAVAILABLE, e.getMessage());
          }
        });
  }

  private void handleFoodAnalysisResult(int requestCode, int resultCode, @Nullable Intent data) {
    if (pendingFoodPromise == null || pendingFoodOptions == null) {
      FoodPhotoCapture.deleteQuietly(pendingCameraFile);
      pendingCameraFile = null;
      return;
    }

    if (resultCode != Activity.RESULT_OK) {
      FoodPhotoCapture.deleteQuietly(pendingCameraFile);
      pendingCameraFile = null;
      rejectPendingFood(CANCELLED, "Food photo capture cancelled");
      return;
    }

    final Uri imageUri;
    final File tempToDelete;
    if (requestCode == REQUEST_FOOD_CAMERA) {
      if (pendingCameraFile == null || !pendingCameraFile.exists()) {
        rejectPendingFood(UNAVAILABLE, "Captured photo file missing");
        return;
      }
      // ContentResolver 는 file:// 보다 FileProvider content URI 를 안정적으로 연다
      imageUri = FoodPhotoCapture.toContentUri(getReactApplicationContext(), pendingCameraFile);
      tempToDelete = pendingCameraFile;
      pendingCameraFile = null;
    } else {
      if (data == null || data.getData() == null) {
        rejectPendingFood(CANCELLED, "No photo selected");
        return;
      }
      imageUri = data.getData();
      tempToDelete = null;
    }

    final PendingFoodOptions options = pendingFoodOptions;
    final Promise promise = pendingFoodPromise;
    pendingFoodPromise = null;
    pendingFoodOptions = null;

    foodVisionExecutor.execute(
        () -> {
          try {
            FoodVisionEngine.Result result =
                ensureFoodVisionEngine()
                    .analyze(
                        imageUri,
                        BuildConfig.VERSION_NAME,
                        options.profile,
                        options.minConfidence,
                        options.maxItems,
                        options.includeCandidates);
            promise.resolve(toFoodAnalysisMap(result));
          } catch (Exception e) {
            Log.e(TAG, "analyzeFoodImage failed", e);
            promise.reject(UNAVAILABLE, e.getMessage());
          } finally {
            FoodPhotoCapture.deleteQuietly(tempToDelete);
          }
        });
  }

  private void handleStandaloneCaptureResult(
      int requestCode, int resultCode, @Nullable Intent data) {
    if (pendingFoodPromise == null) {
      FoodPhotoCapture.deleteQuietly(pendingCameraFile);
      pendingCameraFile = null;
      return;
    }

    Promise promise = pendingFoodPromise;
    File tempFile = pendingCameraFile;
    pendingFoodPromise = null;
    pendingCameraFile = null;

    if (resultCode != Activity.RESULT_OK) {
      FoodPhotoCapture.deleteQuietly(tempFile);
      promise.reject(CANCELLED, "Photo capture cancelled");
      return;
    }

    try {
      WritableMap map = Arguments.createMap();
      if (requestCode == REQUEST_CAPTURE_CAMERA) {
        if (tempFile == null || !tempFile.exists()) {
          promise.reject(UNAVAILABLE, "Captured photo file missing");
          return;
        }
        Uri contentUri = FoodPhotoCapture.toContentUri(getReactApplicationContext(), tempFile);
        map.putString("uri", contentUri.toString());
        map.putString("mimeType", "image/jpeg");
      } else {
        if (data == null || data.getData() == null) {
          promise.reject(CANCELLED, "No photo selected");
          return;
        }
        map.putString("uri", data.getData().toString());
      }
      promise.resolve(map);
    } catch (Exception e) {
      FoodPhotoCapture.deleteQuietly(tempFile);
      promise.reject(UNAVAILABLE, e.getMessage());
    }
  }

  private FoodVisionEngine ensureFoodVisionEngine() {
    if (foodVisionEngine == null) {
      foodVisionEngine = new FoodVisionEngine(getReactApplicationContext());
    }
    return foodVisionEngine;
  }

  private void rejectPendingFood(String code, String message) {
    Promise promise = pendingFoodPromise;
    File tempFile = pendingCameraFile;
    pendingFoodPromise = null;
    pendingFoodOptions = null;
    pendingCameraFile = null;
    FoodPhotoCapture.deleteQuietly(tempFile);
    if (promise != null) {
      promise.reject(code, message != null ? message : code);
    }
  }

  private void grantCameraUriPermissions(Intent intent, Uri uri) {
    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
    List<ResolveInfo> resolvers =
        getReactApplicationContext()
            .getPackageManager()
            .queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY);
    for (ResolveInfo resolver : resolvers) {
      getReactApplicationContext()
          .grantUriPermission(
              resolver.activityInfo.packageName,
              uri,
              Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
    }
  }

  private static WritableMap toFoodAnalysisMap(FoodVisionEngine.Result result) {
    WritableMap map = Arguments.createMap();
    WritableArray items = Arguments.createArray();
    for (FoodVisionAggregator.AggregatedItem item : result.items) {
      FoodCatalog.FoodClass food = result.catalog.get(item.classId);
      if (food == null) {
        continue;
      }
      FoodDetection detection = item.representative();
      WritableMap entry = Arguments.createMap();
      entry.putString("classKey", food.classKey);
      if (food.nameKo != null && !food.nameKo.isEmpty()) {
        entry.putString("nameKo", food.nameKo);
      }
      entry.putDouble("confidence", detection.confidence);
      entry.putInt("quantity", item.quantity());
      if (food.servingG > 0f) {
        entry.putDouble("servingG", food.servingG);
      }
      int preview = food.previewKcal(1f, item.quantity());
      if (preview >= 0) {
        entry.putInt("kcalPreview", preview);
      }
      float[] bbox = result.geometry.toSourceXywh(detection);
      WritableArray bboxArray = Arguments.createArray();
      bboxArray.pushDouble(bbox[0]);
      bboxArray.pushDouble(bbox[1]);
      bboxArray.pushDouble(bbox[2]);
      bboxArray.pushDouble(bbox[3]);
      entry.putArray("bbox", bboxArray);

      WritableArray candidates = Arguments.createArray();
      int[] candidateIds = detection.candidateClassIds;
      float[] candidateScores = detection.candidateScores;
      if (candidateIds != null) {
        for (int i = 0; i < candidateIds.length; i++) {
          FoodCatalog.FoodClass candidateFood = result.catalog.get(candidateIds[i]);
          if (candidateFood == null) {
            continue;
          }
          WritableMap candidate = Arguments.createMap();
          candidate.putString("classKey", candidateFood.classKey);
          if (candidateFood.nameKo != null && !candidateFood.nameKo.isEmpty()) {
            candidate.putString("nameKo", candidateFood.nameKo);
          }
          candidate.putDouble(
              "confidence",
              candidateScores != null && i < candidateScores.length
                  ? candidateScores[i]
                  : 0d);
          candidates.pushMap(candidate);
        }
      }
      entry.putArray("candidates", candidates);
      items.pushMap(entry);
    }

    map.putArray("items", items);
    map.putString("modelVersion", result.modelVersion);
    map.putString("catalogVersion", result.catalogVersion);
    map.putString("profile", result.profile);
    map.putDouble("inferenceMs", result.inferenceMs);
    map.putString("capturedAt", isoNow());
    map.putInt("imageWidth", result.imageWidth);
    map.putInt("imageHeight", result.imageHeight);
    return map;
  }

  private static String isoNow() {
    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", Locale.US);
    format.setTimeZone(TimeZone.getDefault());
    return format.format(new Date());
  }

  /** @param heartRateImplemented Health Connect 가용 여부 */
  static WritableMap buildCapabilities(boolean heartRateImplemented) {
    WritableMap root = Arguments.createMap();
    root.putString("platform", "android");

    root.putMap("camera", capability(true, true, "android.permission.CAMERA"));
    root.putMap(
        "photoLibrary",
        capability(true, true, "android.permission.READ_MEDIA_IMAGES"));
    root.putMap(
        "location",
        capability(true, heartRateImplemented, "android.permission.ACCESS_FINE_LOCATION"));
    root.putMap(
        "biometrics",
        capability(true, true, "android.permission.USE_BIOMETRIC"));
    root.putMap("stepCounter", capability(true, true, "android.permission.ACTIVITY_RECOGNITION"));
    root.putMap(
        "speechRecognition",
        capability(true, true, "android.permission.RECORD_AUDIO"));
    root.putMap("foodVision", capability(true, true, "android.permission.CAMERA"));

    WritableMap vitals = Arguments.createMap();
    vitals.putMap(
        "HEART_RATE",
        capability(true, heartRateImplemented, "android.permission.health.READ_HEART_RATE"));
    vitals.putMap("SPO2", capability(true, false));
    vitals.putMap("BP_SYSTOLIC", capability(true, false));
    vitals.putMap("BP_DIASTOLIC", capability(true, false));
    vitals.putMap("BODY_TEMP", capability(true, false));
    vitals.putMap("RESPIRATORY_RATE", capability(true, false));
    root.putMap("vitals", vitals);

    return root;
  }

  /** analyzeFoodImage 옵션. ActivityResult 콜백까지 살아 있어야 한다. */
  private static final class PendingFoodOptions {
    final String source;
    final int maxItems;
    final float minConfidence;
    final boolean includeCandidates;
    @Nullable final FoodVisionProfile profile;

    private PendingFoodOptions(
        String source,
        int maxItems,
        float minConfidence,
        boolean includeCandidates,
        @Nullable FoodVisionProfile profile) {
      this.source = source;
      this.maxItems = maxItems;
      this.minConfidence = minConfidence;
      this.includeCandidates = includeCandidates;
      this.profile = profile;
    }

    static PendingFoodOptions from(@Nullable ReadableMap options) {
      String source = "camera";
      int maxItems = DEFAULT_MAX_ITEMS;
      float minConfidence = FoodVisionDecoder.DEFAULT_MIN_CONFIDENCE;
      boolean includeCandidates = true;
      FoodVisionProfile profile = null;

      if (options != null) {
        if (options.hasKey("source") && options.getString("source") != null) {
          source = options.getString("source");
        }
        if (options.hasKey("maxItems") && !options.isNull("maxItems")) {
          maxItems = Math.max(0, (int) options.getDouble("maxItems"));
        }
        if (options.hasKey("minConfidence") && !options.isNull("minConfidence")) {
          minConfidence = (float) options.getDouble("minConfidence");
        }
        if (options.hasKey("includeCandidates") && !options.isNull("includeCandidates")) {
          includeCandidates = options.getBoolean("includeCandidates");
        }
        if (options.hasKey("profile") && options.getString("profile") != null) {
          profile = FoodVisionProfile.fromKey(options.getString("profile"));
        }
      }
      return new PendingFoodOptions(source, maxItems, minConfidence, includeCandidates, profile);
    }
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
