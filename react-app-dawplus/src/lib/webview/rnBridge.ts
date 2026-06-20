/**
 * RN WebView 네이티브 브릿지 (re-export)
 * @see nativeBridgeClient.ts · nativeBridge.types.ts
 */

export * from "@/lib/webview/nativeBridge.types";
export {
  isReactNativeWebView,
  postMessageToNative,
  requestNativeBiometricAuth,
  requestNativeBiometricAvailability,
  requestNativeCapabilities,
  requestNativeCapturePhoto,
  requestNativeFcmToken,
  requestNativeLocation,
  requestNativePickPhoto,
  requestNativeStepCount,
  requestNativeVitalReading,
} from "@/lib/webview/nativeBridgeClient";

function getReactNativeWebView() {
  return (
    window as unknown as {
      ReactNativeWebView?: { postMessage: (msg: string) => void };
    }
  ).ReactNativeWebView;
}

export function notifyWebViewNavigation() {
  getReactNativeWebView()?.postMessage("navigationStateChange");
}

/** RN 앱 메인(홈) 탭으로 복귀 */
export function requestNativeHome() {
  getReactNativeWebView()?.postMessage(JSON.stringify({ type: "goNativeHome" }));
}

/** @deprecated StepCountPopup 등 기존 import 호환 */
export type CamaNativeStepCountDetail = {
  type: "stepCount";
  requestId: string;
  ok: boolean;
  steps?: number;
  error?: string;
};

/** @deprecated 기존 import 호환 */
export type CamaNativeFcmTokenDetail = {
  type: "fcmToken";
  requestId: string;
  ok: boolean;
  firebase?: import("@/apis/types/auth.types").CamaFirebase;
  error?: string;
};
