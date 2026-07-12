export type StepDaily = {
  date: string;
  steps: number;
};

export type HeartRatePoint = {
  /** 일별 추이 (MM-DD 또는 YYYY-MM-DD) */
  date?: string;
  /** 당일 시간대 (HH:mm) — date 없을 때 사용 */
  time?: string;
  bpm: number;
};

export type InquiryStatus = "pending" | "answered" | "closed";

export type InquiryItem = {
  id?: string;
  title: string;
  preview: string;
  /** 작성일 */
  createdAt?: string;
  updatedAt: string;
  status?: InquiryStatus;
};

/** 폰 앱 → 태블릿 BLE로 전송하는 건강 데이터 */
export type HealthDataPayload = {
  patientName?: string;
  patientId?: string;
  steps?: number;
  stepsHistory?: StepDaily[];
  heartRate?: number;
  heartRateHistory?: HeartRatePoint[];
  inquiries?: InquiryItem[];
  /** 데이터 수집 시작일 (선택) */
  periodFrom?: string;
  /** 데이터 수집 종료일 (선택) */
  periodTo?: string;
};

export type QrPayload = {
  v: number;
  app: string;
  deviceId: string;
  deviceName: string;
  serviceUuid: string;
  dataCharUuid: string;
};

export type BleSessionStartedDetail = {
  type: "bleSessionStarted";
  ok: boolean;
  payload: { qrPayload: string };
};

export type HealthDataReceivedDetail = {
  type: "healthDataReceived";
  ok: boolean;
  payload: HealthDataPayload;
};

export type BleConnectedDetail = {
  type: "bleConnected";
  ok: boolean;
  payload: { deviceName: string };
};

export type NativeEventDetail =
  | BleSessionStartedDetail
  | HealthDataReceivedDetail
  | BleConnectedDetail
  | { type: "bleDisconnected"; ok: boolean }
  | { type: "bleSessionStopped"; ok: boolean }
  | { type: "bleError"; ok: boolean; error?: string }
  | { type: "bridgeReady"; ok: boolean };

export type DashboardTab = "health" | "inquiry";
