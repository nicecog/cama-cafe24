/** cama-tablet QR payload (태블릿이 생성, 폰 앱이 스캔) */
export type TabletQrPayload = {
  v: number;
  app: string;
  deviceId: string;
  deviceName: string;
  serviceUuid: string;
  dataCharUuid: string;
};

export type TabletStepDaily = {
  date: string;
  steps: number;
};

export type TabletInquiryItem = {
  id?: string;
  title: string;
  preview: string;
  updatedAt: string;
  status?: "pending" | "answered" | "closed";
};

/** 폰 → 태블릿 BLE JSON (cama-tablet healthData.ts 와 동일) */
export type TabletHealthDataPayload = {
  patientName?: string;
  patientId?: string;
  steps?: number;
  stepsHistory?: TabletStepDaily[];
  heartRate?: number;
  heartRateHistory?: { date?: string; time?: string; bpm: number }[];
  inquiries?: TabletInquiryItem[];
  periodFrom?: string;
  periodTo?: string;
};

export function isTabletQrPayload(value: unknown): value is TabletQrPayload {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    o.app === "cama-tablet" &&
    typeof o.serviceUuid === "string" &&
    typeof o.dataCharUuid === "string" &&
    typeof o.deviceName === "string"
  );
}

export function parseTabletQrPayload(raw: string): TabletQrPayload | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isTabletQrPayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
