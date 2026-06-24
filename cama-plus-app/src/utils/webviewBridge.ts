import type { RefObject } from 'react';
import type WebView from 'react-native-webview';

import type { WebToNativeRequest } from '@/constants/nativeBridge.types';
import { dispatchBridgeRequest } from '@/utils/bridgeHandlers';

export type WebViewBridgeOptions = {
  onNavigationStateChange?: () => void;
  /** SPA 홈 버튼(goNativeHome) 수신 시 호출. 미지정 시 WebView를 /home 으로 이동 */
  onGoNativeHome?: () => void;
};

const NATIVE_HOME_INJECTED_JS = `
  (function () {
    var home = '/home';
    var path = window.location.pathname || '';
    if (path === home || path === home + '/') {
      return;
    }
    window.location.assign(home);
  })();
  true;
`;

/** WebView SPA 메인(홈) 화면으로 이동 */
export function navigateWebViewToHome(
  webviewRef: RefObject<WebView | null>,
): void {
  webviewRef.current?.injectJavaScript(NATIVE_HOME_INJECTED_JS);
}

function handleGoNativeHome(
  webviewRef: RefObject<WebView | null>,
  options: WebViewBridgeOptions,
): void {
  if (options.onGoNativeHome) {
    options.onGoNativeHome();
    return;
  }
  navigateWebViewToHome(webviewRef);
}

function parseBridgeRequest(raw: string): WebToNativeRequest | null {
  try {
    const parsed = JSON.parse(raw) as WebToNativeRequest;
    if (!parsed?.type || typeof parsed.requestId !== 'string') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** WebView postMessage 통합 라우터 */
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

    if (raw === '{"type":"goNativeHome"}') {
      handleGoNativeHome(webviewRef, options);
      return;
    }

    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      parsed = null;
    }

    if (parsed?.type === 'goNativeHome') {
      handleGoNativeHome(webviewRef, options);
      return;
    }

    const request = parseBridgeRequest(raw);
    if (request) {
      void dispatchBridgeRequest(webviewRef, request);
    }
  };
}

/** history hook + RN bridge 준비 (react-app-dawplus 호환) */
export function getCamaWebViewInjectedJavaScript(): string {
  return `
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
      window.__CAMA_NATIVE_BRIDGE_VERSION__ = 2;
    })();
    true;
  `;
}
