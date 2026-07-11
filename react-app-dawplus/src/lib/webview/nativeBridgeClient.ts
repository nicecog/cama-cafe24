import type {
  BiometricAuthOptions,
  BiometricAuthResult,
  BiometricAvailability,
  CameraCaptureOptions,
  CameraCaptureResult,
  DeviceCapabilities,
  LocationOptions,
  LocationResult,
  NativeBridgeResponseBase,
  NativeBridgeResult,
  VitalReadingResult,
  VitalSamplesResult,
  VitalTypeCd,
} from "@/lib/webview/nativeBridge.types";
import type { CamaFirebase } from "@/apis/types/auth.types";
import type {
  TabletHealthDataPayload,
  TabletQrPayload,
} from "@/lib/tablet/tabletTransfer.types";

function getReactNativeWebView() {
  return (
    window as unknown as {
      ReactNativeWebView?: { postMessage: (msg: string) => void };
    }
  ).ReactNativeWebView;
}

export function postMessageToNative(payload: Record<string, unknown>) {
  getReactNativeWebView()?.postMessage(JSON.stringify(payload));
}

export function isReactNativeWebView(): boolean {
  return Boolean(getReactNativeWebView()) || Boolean(window.__CAMA_NATIVE_BRIDGE__);
}

function createRequestId(prefix: string): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}`;
}

function waitForNativeResponse<T extends NativeBridgeResponseBase & { type: string }>(
  responseType: T["type"],
  requestId: string,
  timeoutMs: number,
): Promise<NativeBridgeResult<T>> {
  return new Promise((resolve) => {
    const onNative = (event: Event) => {
      const detail = (event as CustomEvent<T>).detail;
      if (!detail || detail.type !== responseType || detail.requestId !== requestId) {
        return;
      }
      window.removeEventListener("cama-native", onNative as EventListener);
      clearTimeout(timer);
      if (detail.ok) {
        const { requestId: _rid, ok: _ok, error: _err, type: _type, ...data } =
          detail;
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

async function requestBridge<T extends NativeBridgeResponseBase & { type: string }>(
  request: Record<string, unknown>,
  responseType: T["type"],
  timeoutMs = 10000,
): Promise<NativeBridgeResult<T>> {
  if (!isReactNativeWebView()) {
    return { ok: false, error: "UNAVAILABLE" };
  }
  const requestId = createRequestId(String(request.type ?? "bridge"));
  const pending = waitForNativeResponse<T>(responseType, requestId, timeoutMs);
  postMessageToNative({ ...request, requestId });
  return pending;
}

export function requestNativeCapabilities(timeoutMs = 8000) {
  return requestBridge<
    NativeBridgeResponseBase & { type: "capabilities"; capabilities?: DeviceCapabilities }
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

export function requestNativeStepCount(timeoutMs = 8000): Promise<number | null> {
  if (!isReactNativeWebView()) {
    return Promise.resolve(null);
  }
  return requestBridge<
    NativeBridgeResponseBase & { type: "stepCount"; steps?: number }
  >({ type: "getStepCount" }, "stepCount", timeoutMs).then((result) => {
    if (result.ok && typeof result.data.steps === "number" && result.data.steps >= 0) {
      return Math.floor(result.data.steps);
    }
    return null;
  });
}

export function requestNativeOpenHealthConnectSettings(timeoutMs = 10000): Promise<boolean> {
  return requestBridge<
    NativeBridgeResponseBase & { type: "healthConnectSettings" }
  >({ type: "openHealthConnectSettings" }, "healthConnectSettings", timeoutMs).then(
    (result) => result.ok,
  );
}

export function requestNativeFcmToken(timeoutMs = 10000): Promise<CamaFirebase | null> {
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

/** @deprecated use requestNativeCapturePhoto */
export { requestNativeCapturePhoto as requestNativeCamera };

type NativeSpeechCommand =
  | { type: "speakText"; text: string; rate?: number }
  | { type: "stopSpeech" }
  | { type: "pauseSpeech" }
  | { type: "resumeSpeech" };

export function postNativeSpeechCommand(command: NativeSpeechCommand) {
  if (!isReactNativeWebView()) {
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
