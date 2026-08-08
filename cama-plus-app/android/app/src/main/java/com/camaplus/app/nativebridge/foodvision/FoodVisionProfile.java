package com.camaplus.app.nativebridge.foodvision;

import android.app.ActivityManager;
import android.content.Context;
import android.content.SharedPreferences;

/**
 * 입력 해상도 프로필. 브릿지 타입 {@code FoodVisionProfile} 의 문자열과 1:1 이다.
 *
 * <p>저사양 기기에서 416 은 지연이 커지므로 320 으로 강등한다. 강등 판단은 두 갈래다.
 *
 * <ol>
 *   <li>RAM 4GB 미만이면 처음부터 320
 *   <li>첫 추론이 1,800ms 를 넘으면 320 으로 강등하고 <b>영구 저장</b>
 * </ol>
 *
 * <p>강등 기록은 앱 버전이 바뀌면 지운다. 모델·delegate 가 개선될 수 있어 재측정이 필요하다.
 */
public enum FoodVisionProfile {
  INPUT_416("416-int8", "foodvision/yolo26n-kd-416-int8.tflite", 416),
  INPUT_320("320-int8", "foodvision/yolo26n-kd-320-int8.tflite", 320);

  /** 이 시간을 넘기면 다음 실행부터 강등한다. */
  public static final long DOWNGRADE_THRESHOLD_MS = 1800L;

  private static final String PREFS = "cama.foodvision";
  private static final String KEY_PROFILE = "profile";
  private static final String KEY_APP_VERSION = "appVersion";
  private static final long LOW_MEMORY_THRESHOLD_MB = 4096L;

  public final String key;
  public final String assetPath;
  public final int inputSize;

  FoodVisionProfile(String key, String assetPath, int inputSize) {
    this.key = key;
    this.assetPath = assetPath;
    this.inputSize = inputSize;
  }

  public static FoodVisionProfile fromKey(String key) {
    for (FoodVisionProfile profile : values()) {
      if (profile.key.equals(key)) {
        return profile;
      }
    }
    return null;
  }

  /** 저장된 강등 결과 → RAM 판정 → 기본값(416) 순으로 결정한다. */
  public static FoodVisionProfile resolve(Context context, String appVersion) {
    SharedPreferences prefs = prefs(context);
    if (appVersion != null && !appVersion.equals(prefs.getString(KEY_APP_VERSION, null))) {
      prefs.edit().remove(KEY_PROFILE).putString(KEY_APP_VERSION, appVersion).apply();
    } else {
      FoodVisionProfile stored = fromKey(prefs.getString(KEY_PROFILE, null));
      if (stored != null) {
        return stored;
      }
    }
    return isLowMemoryDevice(context) ? INPUT_320 : INPUT_416;
  }

  public static void remember(Context context, FoodVisionProfile profile) {
    prefs(context).edit().putString(KEY_PROFILE, profile.key).apply();
  }

  private static SharedPreferences prefs(Context context) {
    return context.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
  }

  private static boolean isLowMemoryDevice(Context context) {
    ActivityManager manager =
        (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
    if (manager == null) {
      return false;
    }
    if (manager.isLowRamDevice()) {
      return true;
    }
    ActivityManager.MemoryInfo info = new ActivityManager.MemoryInfo();
    manager.getMemoryInfo(info);
    return info.totalMem / (1024L * 1024L) < LOW_MEMORY_THRESHOLD_MB;
  }
}
