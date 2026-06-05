/** RN WebView postMessage 호환 (cama-plus-app handleOnMessage) */

export type CamaNativeStepCountDetail = {
  type: "stepCount";
  requestId: string;
  ok: boolean;
  steps?: number;
  error?: string;
};

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

export function postMessageToNative(payload: Record<string, unknown>) {
  getReactNativeWebView()?.postMessage(JSON.stringify(payload));
}

/** RN 앱 메인(홈) 탭으로 복귀 — WebView 안에서 SPA /home 으로 가면 탭바가 사라짐 */
export function requestNativeHome() {
  postMessageToNative({ type: "goNativeHome" });
}

export function isReactNativeWebView(): boolean {
  return Boolean(getReactNativeWebView()) || Boolean(window.__CAMA_NATIVE_BRIDGE__);
}

/**
 * Android 네이티브 걸음수 (TYPE_STEP_COUNTER) — WebView에서 RN 모듈 요청
 */
export function requestNativeStepCount(timeoutMs = 8000): Promise<number | null> {
  const rn = getReactNativeWebView();
  if (!rn) {
    return Promise.resolve(null);
  }

  const requestId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `step-${Date.now()}`;

  return new Promise((resolve) => {
    const onNative = (event: Event) => {
      const detail = (event as CustomEvent<CamaNativeStepCountDetail>).detail;
      if (!detail || detail.type !== "stepCount" || detail.requestId !== requestId) {
        return;
      }
      window.removeEventListener("cama-native", onNative as EventListener);
      clearTimeout(timer);
      if (detail.ok && typeof detail.steps === "number" && detail.steps >= 0) {
        resolve(Math.floor(detail.steps));
      } else {
        resolve(null);
      }
    };

    const timer = window.setTimeout(() => {
      window.removeEventListener("cama-native", onNative as EventListener);
      resolve(null);
    }, timeoutMs);

    window.addEventListener("cama-native", onNative as EventListener);
    postMessageToNative({ type: "getStepCount", requestId });
  });
}
