package com.camaplus.app.nativebridge;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

public class CamaNativeBridgeModule extends ReactContextBaseJavaModule {

  private static final String MODULE = "CamaNativeBridge";
  private static final String NOT_IMPLEMENTED = "NOT_IMPLEMENTED";

  public CamaNativeBridgeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return MODULE;
  }

  @ReactMethod
  public void getCapabilities(Promise promise) {
    try {
      promise.resolve(buildCapabilities(false));
    } catch (Exception e) {
      promise.reject("CAPABILITIES_ERROR", e.getMessage());
    }
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
    rejectNotImplemented(promise);
  }

  @ReactMethod
  public void isBiometricAvailable(Promise promise) {
    rejectNotImplemented(promise);
  }

  @ReactMethod
  public void authenticateBiometric(ReadableMap options, Promise promise) {
    rejectNotImplemented(promise);
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
    vitals.putMap("HEART_RATE", capability(true, implemented));
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
      map.putArray(
          "permissionRequired",
          Arguments.fromArray(permissions));
    }
    return map;
  }
}
