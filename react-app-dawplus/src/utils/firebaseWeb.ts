import type { CamaFirebase } from "@/apis/types/auth.types";
import {
  isReactNativeWebView,
  requestNativeFcmToken,
} from "@/lib/webview/rnBridge";

const WEB_NO_FCM = "web-no-fcm";

/** 웹 SPA용 Firebase DTO — RN WebView에서는 네이티브 FCM 토큰 사용 */
export async function createWebFirebaseInfo(): Promise<CamaFirebase> {
  if (isReactNativeWebView()) {
    const nativeFirebase = await requestNativeFcmToken();
    if (nativeFirebase?.token && nativeFirebase.token !== WEB_NO_FCM) {
      return nativeFirebase;
    }
  }

  const ua =
    typeof navigator !== "undefined" ? navigator.userAgent : "web-browser";
  const isIos = /iPhone|iPad|iPod/i.test(ua);

  return {
    device: "cama-web-spa",
    platform: isIos ? "IOS" : "ANDROID",
    token: WEB_NO_FCM,
  };
}
