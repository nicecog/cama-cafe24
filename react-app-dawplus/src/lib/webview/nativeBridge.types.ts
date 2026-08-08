/** WebView ↔ RN 네이티브 브릿지 프로토콜 (cama-plus-app 과 동기화) */

export const NATIVE_BRIDGE_ERRORS = {
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  UNAVAILABLE: "UNAVAILABLE",
  CANCELLED: "CANCELLED",
  TIMEOUT: "TIMEOUT",
  INVALID_ARGUMENT: "INVALID_ARGUMENT",
} as const;

export type NativeBridgeErrorCode =
  (typeof NATIVE_BRIDGE_ERRORS)[keyof typeof NATIVE_BRIDGE_ERRORS];

export type NativePlatform = "android" | "ios";

export type VitalTypeCd =
  | "HEART_RATE"
  | "BP_SYSTOLIC"
  | "BP_DIASTOLIC"
  | "SPO2"
  | "BODY_TEMP"
  | "RESPIRATORY_RATE";

export type VitalSourceCd = "MANUAL" | "PHONE" | "WEARABLE";

export type BiometryType =
  | "FINGERPRINT"
  | "FACE"
  | "IRIS"
  | "UNKNOWN"
  | "NONE";

export type CapabilityStatus = {
  available: boolean;
  implemented: boolean;
  permissionRequired?: string[];
};

export type DeviceCapabilities = {
  platform: NativePlatform;
  camera: CapabilityStatus;
  photoLibrary: CapabilityStatus;
  location: CapabilityStatus;
  biometrics: CapabilityStatus;
  stepCounter: CapabilityStatus;
  speechRecognition?: CapabilityStatus;
  foodVision?: CapabilityStatus;
  vitals: Partial<Record<VitalTypeCd, CapabilityStatus>>;
};

export type SpeechRecognitionOptions = {
  locale?: string;
  maxDurationMs?: number;
  partialResults?: boolean;
  prompt?: string;
};

export type SpeechRecognitionAvailability = {
  available: boolean;
  implemented: boolean;
};

export type CameraFacing = "front" | "back";

export type CameraCaptureOptions = {
  facing?: CameraFacing;
  quality?: number;
  includeBase64?: boolean;
  maxWidth?: number;
  maxHeight?: number;
};

export type CameraCaptureResult = {
  uri?: string;
  base64?: string;
  width?: number;
  height?: number;
  mimeType?: string;
};

export type LocationOptions = {
  highAccuracy?: boolean;
  maximumAgeMs?: number;
  timeoutMs?: number;
};

export type LocationResult = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
};

export type VitalReadingResult = {
  vitalTypeCd: VitalTypeCd;
  valueNum: number;
  unit?: string;
  measuredAt?: string;
  sourceCd?: VitalSourceCd;
};

export type VitalSamplesResult = {
  vitalTypeCd: VitalTypeCd;
  samples: VitalReadingResult[];
  count: number;
};

export type BiometricAuthOptions = {
  reason?: string;
  title?: string;
  subtitle?: string;
  cancelLabel?: string;
};

export type BiometricAvailability = {
  available: boolean;
  enrolled: boolean;
  biometryType: BiometryType;
};

export type BiometricAuthResult = {
  authenticated: boolean;
  biometryType?: BiometryType;
};

/** 온디바이스 음식 추론 입력 해상도 프로필 */
export type FoodVisionProfile = "416-int8" | "320-int8";

export type FoodVisionSource = "camera" | "library";

export type FoodAnalysisOptions = {
  source?: FoodVisionSource;
  maxItems?: number;
  minConfidence?: number;
  includeCandidates?: boolean;
  profile?: FoodVisionProfile;
};

export type FoodCandidate = {
  classKey: string;
  nameKo?: string;
  confidence: number;
};

export type FoodDetectedItem = {
  classKey: string;
  nameKo?: string;
  confidence: number;
  quantity: number;
  servingG?: number;
  /** 앱 번들 catalog 기준 미리보기. 서버 정본 값이 도착하면 대체된다 */
  kcalPreview?: number;
  /** [x, y, w, h] 정규화 좌표 */
  bbox?: [number, number, number, number];
  candidates?: FoodCandidate[];
};

export type FoodImageAnalysisResult = {
  items: FoodDetectedItem[];
  modelVersion: string;
  catalogVersion: string;
  profile: FoodVisionProfile;
  inferenceMs: number;
  /** ISO-8601 */
  capturedAt: string;
  imageWidth?: number;
  imageHeight?: number;
};

export type FoodVisionInfo = {
  modelVersion: string;
  catalogVersion: string;
  profile: FoodVisionProfile;
  classCount: number;
};

export type NativeBridgeResponseBase = {
  requestId: string;
  ok: boolean;
  error?: NativeBridgeErrorCode | string;
};

export type NativeBridgeResult<T extends NativeBridgeResponseBase> =
  | { ok: true; data: Omit<T, "requestId" | "ok" | "error" | "type"> }
  | { ok: false; error: string };

declare global {
  interface Window {
    __CAMA_NATIVE_BRIDGE__?: boolean;
    __CAMA_NATIVE_BRIDGE_VERSION__?: number;
  }
}
