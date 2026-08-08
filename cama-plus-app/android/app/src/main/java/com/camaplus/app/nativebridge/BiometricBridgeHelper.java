package com.camaplus.app.nativebridge;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;
import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKey;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.UUID;
import java.util.concurrent.Executor;

final class BiometricBridgeHelper {

  private static final String PREFS_DEVICE = "cama_device_prefs";
  private static final String KEY_DEVICE_ID = "device_id";
  private static final String SECRET_PREFS = "cama_biometric_secret_prefs";
  private static final String KEY_SECRET = "refresh_token";

  interface AuthCallback {
    void onSuccess();

    void onError(String code, String message);
  }

  private BiometricBridgeHelper() {}

  static WritableMap availability(@NonNull Context context) {
    BiometricManager manager = BiometricManager.from(context);
    int authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG;
    int can = manager.canAuthenticate(authenticators);
    boolean available =
        can == BiometricManager.BIOMETRIC_SUCCESS
            || can == BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED;
    boolean enrolled = can == BiometricManager.BIOMETRIC_SUCCESS;

    WritableMap map = Arguments.createMap();
    map.putBoolean("available", available);
    map.putBoolean("enrolled", enrolled);
    map.putString("biometryType", enrolled ? guessBiometryType() : "NONE");
    return map;
  }

  static void authenticate(
      @Nullable FragmentActivity activity,
      @Nullable ReadableMap options,
      @NonNull AuthCallback callback) {
    if (activity == null) {
      callback.onError("UNAVAILABLE", "No current activity");
      return;
    }
    WritableMap avail = availability(activity);
    if (!avail.getBoolean("available")) {
      callback.onError("UNAVAILABLE", "Biometric hardware unavailable");
      return;
    }
    if (!avail.getBoolean("enrolled")) {
      callback.onError("UNAVAILABLE", "No biometric enrolled");
      return;
    }

    String title =
        options != null && options.hasKey("title") && options.getString("title") != null
            ? options.getString("title")
            : "생체 인증";
    String reason =
        options != null && options.hasKey("reason") && options.getString("reason") != null
            ? options.getString("reason")
            : "본인 확인을 위해 인증해 주세요.";
    String cancel =
        options != null && options.hasKey("cancelLabel") && options.getString("cancelLabel") != null
            ? options.getString("cancelLabel")
            : "취소";

    Executor executor = ContextCompat.getMainExecutor(activity);
    BiometricPrompt prompt =
        new BiometricPrompt(
            activity,
            executor,
            new BiometricPrompt.AuthenticationCallback() {
              @Override
              public void onAuthenticationSucceeded(
                  @NonNull BiometricPrompt.AuthenticationResult result) {
                callback.onSuccess();
              }

              @Override
              public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                if (errorCode == BiometricPrompt.ERROR_USER_CANCELED
                    || errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON
                    || errorCode == BiometricPrompt.ERROR_CANCELED) {
                  callback.onError("CANCELLED", errString.toString());
                } else {
                  callback.onError("UNAVAILABLE", errString.toString());
                }
              }
            });

    BiometricPrompt.PromptInfo info =
        new BiometricPrompt.PromptInfo.Builder()
            .setTitle(title)
            .setSubtitle(reason)
            .setNegativeButtonText(cancel)
            .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
            .build();
    prompt.authenticate(info);
  }

  static void authenticateForPromise(
      @Nullable FragmentActivity activity, @Nullable ReadableMap options, Promise promise) {
    authenticate(
        activity,
        options,
        new AuthCallback() {
          @Override
          public void onSuccess() {
            WritableMap map = Arguments.createMap();
            map.putBoolean("authenticated", true);
            map.putString("biometryType", guessBiometryType());
            promise.resolve(map);
          }

          @Override
          public void onError(String code, String message) {
            promise.reject(code, message);
          }
        });
  }

  static void storeSecret(@NonNull Context context, String secret, Promise promise) {
    try {
      if (secret == null || secret.trim().isEmpty()) {
        promise.reject("INVALID_ARGUMENT", "secret required");
        return;
      }
      secretPrefs(context).edit().putString(KEY_SECRET, secret.trim()).apply();
      WritableMap map = Arguments.createMap();
      map.putBoolean("stored", true);
      promise.resolve(map);
    } catch (Exception e) {
      promise.reject("UNAVAILABLE", e.getMessage(), e);
    }
  }

  static void getSecret(
      @Nullable FragmentActivity activity, @NonNull Context context, Promise promise) {
    try {
      String secret = secretPrefs(context).getString(KEY_SECRET, null);
      if (secret == null || secret.isEmpty()) {
        promise.reject("UNAVAILABLE", "No biometric secret");
        return;
      }
      WritableMap options = Arguments.createMap();
      options.putString("title", "생체 로그인");
      options.putString("reason", "생체 인증으로 로그인합니다.");
      authenticate(
          activity,
          options,
          new AuthCallback() {
            @Override
            public void onSuccess() {
              WritableMap map = Arguments.createMap();
              map.putString("secret", secret);
              promise.resolve(map);
            }

            @Override
            public void onError(String code, String message) {
              promise.reject(code, message);
            }
          });
    } catch (Exception e) {
      promise.reject("UNAVAILABLE", e.getMessage(), e);
    }
  }

  static void clearSecret(@NonNull Context context, Promise promise) {
    try {
      secretPrefs(context).edit().remove(KEY_SECRET).apply();
      WritableMap map = Arguments.createMap();
      map.putBoolean("cleared", true);
      promise.resolve(map);
    } catch (Exception e) {
      promise.reject("UNAVAILABLE", e.getMessage(), e);
    }
  }

  static void hasSecret(@NonNull Context context, Promise promise) {
    try {
      String secret = secretPrefs(context).getString(KEY_SECRET, null);
      WritableMap map = Arguments.createMap();
      map.putBoolean("hasSecret", secret != null && !secret.isEmpty());
      promise.resolve(map);
    } catch (Exception e) {
      promise.reject("UNAVAILABLE", e.getMessage(), e);
    }
  }

  static void getDeviceId(@NonNull Context context, Promise promise) {
    try {
      SharedPreferences prefs =
          context.getSharedPreferences(PREFS_DEVICE, Context.MODE_PRIVATE);
      String id = prefs.getString(KEY_DEVICE_ID, null);
      if (id == null || id.isEmpty()) {
        id = UUID.randomUUID().toString();
        prefs.edit().putString(KEY_DEVICE_ID, id).apply();
      }
      WritableMap map = Arguments.createMap();
      map.putString("deviceId", id);
      promise.resolve(map);
    } catch (Exception e) {
      promise.reject("UNAVAILABLE", e.getMessage(), e);
    }
  }

  private static SharedPreferences secretPrefs(Context context) throws Exception {
    MasterKey masterKey =
        new MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build();
    return EncryptedSharedPreferences.create(
        context,
        SECRET_PREFS,
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM);
  }

  private static String guessBiometryType() {
    if (Build.VERSION.SDK_INT >= 29) {
      return "UNKNOWN";
    }
    return "FINGERPRINT";
  }
}
