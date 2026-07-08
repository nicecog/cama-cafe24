export type StepDaily = {
  date: string;
  steps: number;
};

export type HeartRatePoint = {
  time: string;
  bpm: number;
};

export type InquiryItem = {
  title: string;
  preview: string;
  updatedAt: string;
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
