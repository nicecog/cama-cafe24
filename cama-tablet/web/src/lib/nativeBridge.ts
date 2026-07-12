/** Android WebView ↔ React 브릿지 (cama-tablet 오프라인 앱) */

import type { NativeEventDetail } from "../types/healthData";
import type { HealthDataPayload } from "../types/healthData";
import { generateMockHealthData } from "./mockHealthData";

declare global {
  interface Window {
    CamaTabletBridge?: {
      generateQr: () => void;
      stopBleSession: () => void;
      clearLastHealthData?: () => void;
      getCapabilities: () => string;
      getBridgeVersion: () => number;
      getLastHealthData?: () => string;
    };
    AndroidBridge?: Window["CamaTabletBridge"];
    __CAMA_TABLET_BRIDGE__?: boolean;
  }
}

const HEALTH_STORAGE_KEY = "cama-tablet-health-data";

export function persistHealthData(data: HealthDataPayload): void {
  try {
    sessionStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
}

export function clearPersistedHealthData(): void {
  try {
    sessionStorage.removeItem(HEALTH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  const bridge = window.AndroidBridge ?? window.CamaTabletBridge;
  bridge?.clearLastHealthData?.();
}

export function loadPersistedHealthData(): HealthDataPayload | null {
  try {
    const raw = sessionStorage.getItem(HEALTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HealthDataPayload;
  } catch {
    return null;
  }
}

export function readNativeLastHealthData(): HealthDataPayload | null {
  const bridge = window.AndroidBridge ?? window.CamaTabletBridge;
  const raw = bridge?.getLastHealthData?.();
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as HealthDataPayload;
    persistHealthData(data);
    return data;
  } catch {
    return null;
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

/** 브라우저 개발용: 테스트 건강 데이터 시뮬레이션 (약 3개월) */
export function simulateHealthData(): void {
  window.dispatchEvent(
    new CustomEvent("cama-tablet-native", {
      detail: {
        type: "healthDataReceived",
        ok: true,
        payload: generateMockHealthData(),
      },
    }),
  );
}
