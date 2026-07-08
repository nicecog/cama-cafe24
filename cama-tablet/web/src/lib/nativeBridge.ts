/** Android WebView ↔ React 브릿지 (cama-tablet 오프라인 앱) */

import type { NativeEventDetail } from "../types/healthData";

declare global {
  interface Window {
    CamaTabletBridge?: {
      generateQr: () => void;
      stopBleSession: () => void;
      getCapabilities: () => string;
      getBridgeVersion: () => number;
    };
    AndroidBridge?: Window["CamaTabletBridge"];
    __CAMA_TABLET_BRIDGE__?: boolean;
  }
}

export function isNativeApp(): boolean {
  return !!(window.AndroidBridge || window.CamaTabletBridge);
}

export function requestGenerateQr(): void {
  const bridge = window.AndroidBridge ?? window.CamaTabletBridge;
  if (bridge?.generateQr) {
    bridge.generateQr();
    return;
  }
  // 브라우저 개발용: 테스트 QR payload
  const testPayload = JSON.stringify({
    v: 1,
    app: "cama-tablet",
    deviceId: "dev-browser",
    deviceName: "CAMA-Tablet-DEV",
    serviceUuid: "F47AC10B-58CC-4372-A567-0E02B2C3D479",
    dataCharUuid: "6BA7B810-9DAD-11D1-80B4-00C04FD29E95",
  });
  window.dispatchEvent(
    new CustomEvent("cama-tablet-native", {
      detail: {
        type: "bleSessionStarted",
        ok: true,
        payload: { qrPayload: testPayload },
      },
    }),
  );
}

export function requestStopBle(): void {
  const bridge = window.AndroidBridge ?? window.CamaTabletBridge;
  bridge?.stopBleSession?.();
}

export function onNativeEvent(handler: (detail: NativeEventDetail) => void): () => void {
  const listener = (e: Event) => {
    const ce = e as CustomEvent<NativeEventDetail>;
    if (ce.detail?.type) {
      handler(ce.detail);
    }
  };
  window.addEventListener("cama-tablet-native", listener);
  return () => window.removeEventListener("cama-tablet-native", listener);
}

/** 브라우저 개발용: 테스트 건강 데이터 시뮬레이션 */
export function simulateHealthData(): void {
  window.dispatchEvent(
    new CustomEvent("cama-tablet-native", {
      detail: {
        type: "healthDataReceived",
        ok: true,
        payload: {
          patientName: "김환자 (테스트)",
          patientId: "test-001",
          steps: 8432,
          stepsHistory: [
            { date: "07-02", steps: 6200 },
            { date: "07-03", steps: 7100 },
            { date: "07-04", steps: 5800 },
            { date: "07-05", steps: 9200 },
            { date: "07-06", steps: 8100 },
            { date: "07-07", steps: 7600 },
            { date: "07-08", steps: 8432 },
          ],
          heartRate: 72,
          heartRateHistory: [
            { time: "08:00", bpm: 68 },
            { time: "10:00", bpm: 74 },
            { time: "12:00", bpm: 78 },
            { time: "14:00", bpm: 71 },
            { time: "16:00", bpm: 72 },
          ],
          inquiries: [
            {
              title: "혈압 관리 방법",
              preview: "아침 혈압 측정 후 기록해 주세요.",
              updatedAt: "2026-07-05",
            },
            {
              title: "식이요법 안내",
              preview: "나트륨 섭취를 줄이고 채소를 충분히 드세요.",
              updatedAt: "2026-07-03",
            },
          ],
        },
      },
    }),
  );
}
