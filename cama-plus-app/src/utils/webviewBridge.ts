import type { RefObject } from 'react';
import type WebView from 'react-native-webview';
import Tts from 'react-native-tts';
import { getTodayStepCountFromDevice } from '@/native/StepCounter';

export type WebViewBridgeOptions = {
  onNavigationStateChange?: () => void;
  onBottomSheet?: (visible: boolean) => void;
  /** SPA 건강코칭 헤더 「홈으로」 — RN 메인 홈 탭 복귀 */
  onGoNativeHome?: () => void;
};

type WebToNativeMessage =
  | { type: 'getStepCount'; requestId: string }
  | { type: string; [key: string]: unknown };

function injectNativeEvent(
  webviewRef: RefObject<WebView | null>,
  detail: Record<string, unknown>,
) {
  const payload = JSON.stringify(detail).replace(/</g, '\\u003c');
  webviewRef.current?.injectJavaScript(`
    (function() {
      try {
        window.dispatchEvent(new CustomEvent('cama-native', { detail: ${payload} }));
      } catch (e) {}
    })();
    true;
  `);
}

async function handleGetStepCount(
  webviewRef: RefObject<WebView | null>,
  requestId: string,
) {
  try {
    const steps = await getTodayStepCountFromDevice();
    injectNativeEvent(webviewRef, {
      type: 'stepCount',
      requestId,
      steps,
      ok: true,
    });
  } catch (error) {
    const code =
      error instanceof Error ? error.message : 'STEP_COUNTER_FAILED';
    injectNativeEvent(webviewRef, {
      type: 'stepCount',
      requestId,
      ok: false,
      error: code,
    });
  }
}

/** WebView postMessage 통합 (navigationStateChange · TTS · 걸음수) */
export function createWebViewMessageHandler(
  webviewRef: RefObject<WebView | null>,
  options: WebViewBridgeOptions = {},
) {
  return (event: { nativeEvent: { data: string } }) => {
    const raw = event.nativeEvent.data;

    if (raw === 'navigationStateChange') {
      options.onNavigationStateChange?.();
      return;
    }

    let parsed: WebToNativeMessage | null = null;
    try {
      parsed = JSON.parse(raw) as WebToNativeMessage;
    } catch {
      parsed = null;
    }

    if (parsed?.type === 'getStepCount' && typeof parsed.requestId === 'string') {
      void handleGetStepCount(webviewRef, parsed.requestId);
      return;
    }

    if (parsed?.type === 'goNativeHome') {
      options.onGoNativeHome?.();
      return;
    }

    if (!parsed?.type) {
      return;
    }

    const sentence =
      typeof parsed.data === 'string' ? parsed.data : '';
    const msgType = parsed.type;

    if (msgType === 'TS') {
      Tts.setDefaultLanguage('ko-KR');
      Tts.stop();
      Tts.speak(sentence);
    } else if (msgType === 'TP') {
      Tts.stop();
    } else if (msgType === 'BS') {
      options.onBottomSheet?.(true);
    } else {
      options.onBottomSheet?.(false);
    }
  };
}

/** WebView 첫 로드 전 RN loginId → SPA sessionStorage (Hello CAMA 로그인 방지) */
export function getWebviewSessionBootstrapScript(loginId: string): string {
  const safeId = JSON.stringify(loginId.trim());
  return `
    (function() {
      var id = ${safeId};
      var key = 'cama.auth.session';
      try {
        var raw = sessionStorage.getItem(key);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && parsed.loginId === id) return;
        }
        sessionStorage.setItem(
          key,
          JSON.stringify({ loginId: id, account: { loginId: id } }),
        );
      } catch (e) {}
    })();
    true;
  `;
}

/** history hook + RN bridge 준비 (react-app-dawplus 호환) */
export function getCamaWebViewInjectedJavaScript(loginId?: string | null): string {
  const bootstrap =
    loginId?.trim() != null && loginId.trim() !== ''
      ? getWebviewSessionBootstrapScript(loginId)
      : '';
  const navigationHook = `
    (function() {
      function wrap(fn) {
        return function wrapper() {
          var res = fn.apply(this, arguments);
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage('navigationStateChange');
          }
          return res;
        };
      }
      history.pushState = wrap(history.pushState);
      history.replaceState = wrap(history.replaceState);
      window.addEventListener('popstate', function() {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage('navigationStateChange');
        }
      });
      window.__CAMA_NATIVE_BRIDGE__ = true;
    })();
    true;
  `;
  return `${bootstrap}${navigationHook}`;
}

export function getCamaWebViewInjectedJavaScriptBeforeContentLoaded(
  loginId?: string | null,
): string | undefined {
  if (!loginId?.trim()) {
    return undefined;
  }
  return getWebviewSessionBootstrapScript(loginId);
}
