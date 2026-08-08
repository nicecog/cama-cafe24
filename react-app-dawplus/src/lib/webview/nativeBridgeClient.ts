import type { CamaFirebase } from "@/apis/types/auth.types";
import type {
  TabletHealthDataPayload,
  TabletQrPayload,
} from "@/lib/tablet/tabletTransfer.types";
import type {
  BiometricAuthOptions,
  BiometricAuthResult,
  BiometricAvailability,
  CameraCaptureOptions,
  CameraCaptureResult,
  DeviceCapabilities,
  FoodAnalysisOptions,
  FoodImageAnalysisResult,
  FoodVisionInfo,
  LocationOptions,
  LocationResult,
  NativeBridgeResponseBase,
  NativeBridgeResult,
  SpeechRecognitionOptions,
  VitalReadingResult,
  VitalSamplesResult,
  VitalTypeCd,
} from "@/lib/webview/nativeBridge.types";

function getReactNativeWebView() {
  return (
    window as unknown as {
      ReactNativeWebView?: { postMessage: (msg: string) => void };
    }
  ).ReactNativeWebView;
}

function canPostMessageToNative(): boolean {
  return typeof getReactNativeWebView()?.postMessage === "function";
}

export function postMessageToNative(payload: Record<string, unknown>) {
  if (!canPostMessageToNative()) {
    return false;
  }
  getReactNativeWebView()?.postMessage(JSON.stringify(payload));
  return true;
}

export function isReactNativeWebView(): boolean {
  return (
    Boolean(getReactNativeWebView()) || Boolean(window.__CAMA_NATIVE_BRIDGE__)
  );
}

function createRequestId(prefix: string): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}`;
}

function waitForNativeResponse<
  T extends NativeBridgeResponseBase & { type: string },
>(
  responseType: T["type"],
  requestId: string,
  timeoutMs: number,
): Promise<NativeBridgeResult<T>> {
  return new Promise((resolve) => {
    const onNative = (event: Event) => {
      const detail = (event as CustomEvent<T>).detail;
      if (
        !detail ||
        detail.type !== responseType ||
        detail.requestId !== requestId
      ) {
        return;
      }
      window.removeEventListener("cama-native", onNative as EventListener);
      clearTimeout(timer);
      if (detail.ok) {
        const {
          requestId: _rid,
          ok: _ok,
          error: _err,
          type: _type,
          ...data
        } = detail;
        resolve({ ok: true, data });
      } else {
        resolve({ ok: false, error: detail.error ?? "UNKNOWN" });
      }
    };

    const timer = window.setTimeout(() => {
      window.removeEventListener("cama-native", onNative as EventListener);
      resolve({ ok: false, error: "TIMEOUT" });
    }, timeoutMs);

    window.addEventListener("cama-native", onNative as EventListener);
  });
}

async function requestBridge<
  T extends NativeBridgeResponseBase & { type: string },
>(
  request: Record<string, unknown>,
  responseType: T["type"],
  timeoutMs = 10000,
): Promise<NativeBridgeResult<T>> {
  if (!canPostMessageToNative()) {
    return { ok: false, error: "UNAVAILABLE" };
  }
  const requestId = createRequestId(String(request.type ?? "bridge"));
  const pending = waitForNativeResponse<T>(responseType, requestId, timeoutMs);
  if (!postMessageToNative({ ...request, requestId })) {
    return { ok: false, error: "UNAVAILABLE" };
  }
  return pending;
}

export function requestNativeCapabilities(timeoutMs = 8000) {
  return requestBridge<
    NativeBridgeResponseBase & {
      type: "capabilities";
      capabilities?: DeviceCapabilities;
    }
  >({ type: "getCapabilities" }, "capabilities", timeoutMs);
}

export function requestNativeCapturePhoto(
  options: CameraCaptureOptions = {},
  timeoutMs = 30000,
) {
  return requestBridge<
    NativeBridgeResponseBase & { type: "cameraCapture" } & CameraCaptureResult
  >({ type: "capturePhoto", options }, "cameraCapture", timeoutMs);
}

export function requestNativePickPhoto(
  options: CameraCaptureOptions = {},
  timeoutMs = 30000,
) {
  return requestBridge<
    NativeBridgeResponseBase & { type: "cameraCapture" } & CameraCaptureResult
  >({ type: "pickPhoto", options }, "cameraCapture", timeoutMs);
}

export function requestNativeLocation(
  options: LocationOptions = {},
  timeoutMs = 15000,
) {
  return requestBridge<
    NativeBridgeResponseBase & { type: "location" } & LocationResult
  >({ type: "getCurrentLocation", options }, "location", timeoutMs);
}

export function requestNativeVitalReading(
  vitalTypeCd: VitalTypeCd,
  timeoutMs = 15000,
) {
  return requestBridge<
    NativeBridgeResponseBase & { type: "vitalReading" } & VitalReadingResult
  >({ type: "readVital", vitalTypeCd }, "vitalReading", timeoutMs);
}

export function requestNativeVitalSamples(
  vitalTypeCd: VitalTypeCd = "HEART_RATE",
  daysBack = 1,
  timeoutMs = 15000,
): Promise<VitalSamplesResult | null> {
  if (!isReactNativeWebView()) {
    return Promise.resolve(null);
  }
  return requestBridge<
    NativeBridgeResponseBase & { type: "vitalSamples" } & VitalSamplesResult
  >(
    { type: "readVitalSamples", vitalTypeCd, daysBack },
    "vitalSamples",
    timeoutMs,
  ).then((result) => {
    if (!result.ok) {
      if (result.error === "PERMISSION_DENIED") {
        throw new Error("PERMISSION_DENIED");
      }
      return null;
    }
    if (!Array.isArray(result.data.samples)) {
      return null;
    }
    return {
      vitalTypeCd: result.data.vitalTypeCd ?? vitalTypeCd,
      samples: result.data.samples,
      count: result.data.count ?? result.data.samples.length,
    };
  });
}

export function requestNativeBiometricAvailability(timeoutMs = 8000) {
  return requestBridge<
    NativeBridgeResponseBase & {
      type: "biometric";
      mode?: "availability";
    } & BiometricAvailability
  >({ type: "checkBiometricAvailable" }, "biometric", timeoutMs);
}

export function requestNativeBiometricAuth(
  options: BiometricAuthOptions = {},
  timeoutMs = 30000,
) {
  return requestBridge<
    NativeBridgeResponseBase & {
      type: "biometric";
      mode?: "authenticate";
    } & BiometricAuthResult
  >({ type: "authenticateBiometric", options }, "biometric", timeoutMs);
}

export function requestNativeStoreBiometricSecret(
  secret: string,
  timeoutMs = 15000,
) {
  return requestBridge<
    NativeBridgeResponseBase & {
      type: "biometric";
      mode?: "storeSecret";
      stored?: boolean;
    }
  >({ type: "storeBiometricSecret", secret }, "biometric", timeoutMs);
}

export function requestNativeGetBiometricSecret(timeoutMs = 30000) {
  return requestBridge<
    NativeBridgeResponseBase & {
      type: "biometric";
      mode?: "getSecret";
      secret?: string;
    }
  >({ type: "getBiometricSecret" }, "biometric", timeoutMs);
}

export function requestNativeClearBiometricSecret(timeoutMs = 10000) {
  if (!isReactNativeWebView()) {
    return Promise.resolve({
      ok: true as const,
      data: { mode: "clearSecret" as const, cleared: true },
    });
  }
  return requestBridge<
    NativeBridgeResponseBase & {
      type: "biometric";
      mode?: "clearSecret";
      cleared?: boolean;
    }
  >({ type: "clearBiometricSecret" }, "biometric", timeoutMs);
}

export function requestNativeHasBiometricSecret(timeoutMs = 8000) {
  if (!isReactNativeWebView()) {
    return Promise.resolve({
      ok: true as const,
      data: { mode: "hasSecret" as const, hasSecret: false },
    });
  }
  return requestBridge<
    NativeBridgeResponseBase & {
      type: "biometric";
      mode?: "hasSecret";
      hasSecret?: boolean;
    }
  >({ type: "hasBiometricSecret" }, "biometric", timeoutMs);
}

export function requestNativeDeviceId(timeoutMs = 8000) {
  if (!isReactNativeWebView()) {
    return Promise.resolve({
      ok: false as const,
      error: "UNAVAILABLE",
    });
  }
  return requestBridge<
    NativeBridgeResponseBase & {
      type: "deviceId";
      deviceId?: string;
    }
  >({ type: "getDeviceId" }, "deviceId", timeoutMs);
}

export function requestNativeStepCount(
  timeoutMs = 8000,
): Promise<number | null> {
  if (!isReactNativeWebView()) {
    return Promise.resolve(null);
  }
  return requestBridge<
    NativeBridgeResponseBase & { type: "stepCount"; steps?: number }
  >({ type: "getStepCount" }, "stepCount", timeoutMs).then((result) => {
    if (
      result.ok &&
      typeof result.data.steps === "number" &&
      result.data.steps >= 0
    ) {
      return Math.floor(result.data.steps);
    }
    return null;
  });
}

export function requestNativeOpenHealthConnectSettings(
  timeoutMs = 10000,
): Promise<boolean> {
  return requestBridge<
    NativeBridgeResponseBase & { type: "healthConnectSettings" }
  >(
    { type: "openHealthConnectSettings" },
    "healthConnectSettings",
    timeoutMs,
  ).then((result) => result.ok);
}

export async function checkNativeSpeechRecognitionAvailable(
  timeoutMs = 8000,
): Promise<{ available: boolean; implemented: boolean }> {
  if (!isReactNativeWebView()) {
    return { available: false, implemented: false };
  }
  const result = await requestBridge<
    NativeBridgeResponseBase & {
      type: "speechRecognition";
      event?: string;
      available?: boolean;
      implemented?: boolean;
    }
  >(
    { type: "checkSpeechRecognitionAvailable" },
    "speechRecognition",
    timeoutMs,
  );

  if (!result.ok) {
    return { available: false, implemented: false };
  }
  return {
    available: Boolean(result.data.available),
    implemented: Boolean(result.data.implemented ?? true),
  };
}

/** Starts STT and returns requestId for correlating cama-native events. */
export function startNativeSpeechRecognition(
  options: SpeechRecognitionOptions = {},
): string | null {
  if (!canPostMessageToNative()) {
    return null;
  }
  const requestId = createRequestId("stt");
  postMessageToNative({
    type: "startSpeechRecognition",
    requestId,
    options: {
      locale: options.locale ?? "ko-KR",
      maxDurationMs: options.maxDurationMs ?? 60_000,
      partialResults: options.partialResults ?? true,
      prompt: options.prompt ?? "말씀해 주세요",
    },
  });
  return requestId;
}

export function stopNativeSpeechRecognition(): string | null {
  if (!canPostMessageToNative()) {
    return null;
  }
  const requestId = createRequestId("stt-stop");
  postMessageToNative({ type: "stopSpeechRecognition", requestId });
  return requestId;
}

export function cancelNativeSpeechRecognition(): string | null {
  if (!canPostMessageToNative()) {
    return null;
  }
  const requestId = createRequestId("stt-cancel");
  postMessageToNative({ type: "cancelSpeechRecognition", requestId });
  return requestId;
}

export function requestNativeFcmToken(
  timeoutMs = 10000,
): Promise<CamaFirebase | null> {
  if (!isReactNativeWebView()) {
    return Promise.resolve(null);
  }
  return requestBridge<
    NativeBridgeResponseBase & { type: "fcmToken"; firebase?: CamaFirebase }
  >({ type: "getFcmToken" }, "fcmToken", timeoutMs).then((result) => {
    if (result.ok && result.data.firebase?.token) {
      return result.data.firebase;
    }
    return null;
  });
}

/**
 * 촬영 + 온디바이스 추론을 네이티브에 위임한다.
 * 촬영 대기 시간이 포함되므로 타임아웃이 다른 요청보다 길다.
 */
export function requestNativeAnalyzeFoodImage(
  options: FoodAnalysisOptions = {},
  timeoutMs = 45000,
) {
  return requestBridge<
    NativeBridgeResponseBase & {
      type: "foodImageAnalysis";
    } & FoodImageAnalysisResult
  >({ type: "analyzeFoodImage", options }, "foodImageAnalysis", timeoutMs);
}

export function requestNativeFoodVisionInfo(timeoutMs = 5000) {
  return requestBridge<
    NativeBridgeResponseBase & { type: "foodVisionInfo" } & FoodVisionInfo
  >({ type: "getFoodVisionInfo" }, "foodVisionInfo", timeoutMs);
}

/** @deprecated use requestNativeCapturePhoto */
export { requestNativeCapturePhoto as requestNativeCamera };

type NativeSpeechCommand =
  | { type: "speakText"; text: string; rate?: number }
  | { type: "stopSpeech" }
  | { type: "pauseSpeech" }
  | { type: "resumeSpeech" };

export function postNativeSpeechCommand(command: NativeSpeechCommand) {
  if (!canPostMessageToNative()) {
    return null;
  }

  const requestId = createRequestId("speech");
  postMessageToNative({ ...command, requestId });
  return requestId;
}

export function shouldUseNativeSpeechSynthesis(): boolean {
  if (!isReactNativeWebView()) {
    return false;
  }

  // iOS/Android WebView 모두 speechSynthesis 미지원 → RN 네이티브 TTS 브릿지 사용
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export function requestNativeTabletQrScan(timeoutMs = 120000) {
  return requestBridge<
    NativeBridgeResponseBase & { type: "tabletQrScan"; raw?: string }
  >({ type: "scanTabletQr" }, "tabletQrScan", timeoutMs);
}

export function requestNativeTabletHealthDataSend(
  qrPayload: TabletQrPayload,
  healthData: TabletHealthDataPayload,
  timeoutMs = 90000,
) {
  return requestBridge<
    NativeBridgeResponseBase & { type: "tabletHealthDataSent" }
  >(
    {
      type: "sendTabletHealthData",
      qrPayload,
      healthData,
    },
    "tabletHealthDataSent",
    timeoutMs,
  );
}
