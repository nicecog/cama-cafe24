import { useMemo } from 'react';
import type { WebViewProps } from 'react-native-webview';
import {
  getCamaWebViewInjectedJavaScript,
  getCamaWebViewInjectedJavaScriptBeforeContentLoaded,
} from '@/utils/webviewBridge';

/** WebView 공통 성능·캐시 옵션 */
export const patientWebViewPerformanceProps: Partial<WebViewProps> = {
  cacheEnabled: true,
  domStorageEnabled: true,
  sharedCookiesEnabled: true,
  javaScriptEnabled: true,
  allowsInlineMediaPlayback: true,
  textZoom: 100,
  androidLayerType: 'hardware',
};

export function usePatientWebViewScripts(loginId?: string | null) {
  return useMemo(
    () => ({
      injectedJavaScriptBeforeContentLoaded:
        getCamaWebViewInjectedJavaScriptBeforeContentLoaded(loginId),
      injectedJavaScript: getCamaWebViewInjectedJavaScript(loginId),
    }),
    [loginId],
  );
}

export function usePatientWebViewSource(uri: string) {
  return useMemo(() => ({ uri }), [uri]);
}
