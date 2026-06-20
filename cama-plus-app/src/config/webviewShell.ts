export const DEV_WEBVIEW_URL = 'http://localhost:5173/';
export const PROD_WEBVIEW_URL = 'https://camaplus.cafe24.com/webview';

export function resolveWebViewUrl(isDev: boolean = __DEV__): string {
  return isDev ? DEV_WEBVIEW_URL : PROD_WEBVIEW_URL;
}

export const WEBVIEW_URL = resolveWebViewUrl();
