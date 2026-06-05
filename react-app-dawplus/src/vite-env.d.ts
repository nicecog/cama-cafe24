/// <reference types="vite/client" />

interface Window {
  __CAMA_NATIVE_BRIDGE__?: boolean;
  ReactNativeWebView?: { postMessage: (msg: string) => void };
}
