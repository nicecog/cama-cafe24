/** Android WebView ↔ React 브릿지 (cama-tablet-android) */

export type ScanResultDetail = {
  type: "scanResult";
  payload: string;
  ok: boolean;
  error?: string;
};

declare global {
  interface Window {
    CamaTabletBridge?: {
      startQrScan: () => void;
    };
    AndroidBridge?: {
      startQrScan: () => void;
    };
  }
}

export function isNativeApp(): boolean {
  return !!(window.AndroidBridge || window.CamaTabletBridge);
}

export function requestQrScan(): void {
  const bridge = window.AndroidBridge ?? window.CamaTabletBridge;
  if (bridge?.startQrScan) {
    bridge.startQrScan();
    return;
  }
  // 브라우저 개발용: v2 서명 QR 또는 v1 레거시 JSON
  const test = prompt(
    "QR payload (dev only)",
    '{"v":2,"t":"<POST /api/tablet/qr/issue 로 발급>"}',
  );
  if (test) {
    window.dispatchEvent(
      new CustomEvent("cama-tablet-native", {
        detail: { type: "scanResult", payload: test, ok: true } satisfies ScanResultDetail,
      }),
    );
  }
}

export function onNativeEvent(handler: (detail: ScanResultDetail) => void): () => void {
  const listener = (e: Event) => {
    const ce = e as CustomEvent<ScanResultDetail>;
    if (ce.detail?.type === "scanResult") {
      handler(ce.detail);
    }
  };
  window.addEventListener("cama-tablet-native", listener);
  return () => window.removeEventListener("cama-tablet-native", listener);
}
