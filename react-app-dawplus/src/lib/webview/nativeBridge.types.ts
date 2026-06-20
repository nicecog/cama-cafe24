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
  vitals: Partial<Record<VitalTypeCd, CapabilityStatus>>;
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

export type NativeBridgeResponseBase = {
  requestId: string;
  ok: boolean;
  error?: NativeBridgeErrorCode | string;
};

export type NativeBridgeResult<T extends NativeBridgeResponseBase> =
  | { ok: true; data: Omit<T, "requestId" | "ok" | "error"> }
  | { ok: false; error: string };

declare global {
  interface Window {
    __CAMA_NATIVE_BRIDGE__?: boolean;
    __CAMA_NATIVE_BRIDGE_VERSION__?: number;
  }
}
