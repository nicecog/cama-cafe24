/** WebView ↔ RN 네이티브 브릿지 프로토콜 (Android · iOS 공통) */

export const NATIVE_BRIDGE_ERRORS = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  UNAVAILABLE: 'UNAVAILABLE',
  CANCELLED: 'CANCELLED',
  TIMEOUT: 'TIMEOUT',
  INVALID_ARGUMENT: 'INVALID_ARGUMENT',
} as const;

export type NativeBridgeErrorCode =
  (typeof NATIVE_BRIDGE_ERRORS)[keyof typeof NATIVE_BRIDGE_ERRORS];

export type NativePlatform = 'android' | 'ios';

export type VitalTypeCd =
  | 'HEART_RATE'
  | 'BP_SYSTOLIC'
  | 'BP_DIASTOLIC'
  | 'SPO2'
  | 'BODY_TEMP'
  | 'RESPIRATORY_RATE';

export type VitalSourceCd = 'MANUAL' | 'PHONE' | 'WEARABLE';

export type BiometryType =
  | 'FINGERPRINT'
  | 'FACE'
  | 'IRIS'
  | 'UNKNOWN'
  | 'NONE';

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

export type CameraFacing = 'front' | 'back';

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

/** SPA → RN 요청 메시지 */
export type WebToNativeRequest =
  | { type: 'getStepCount'; requestId: string }
  | { type: 'getFcmToken'; requestId: string }
  | { type: 'getCapabilities'; requestId: string }
  | { type: 'capturePhoto'; requestId: string; options?: CameraCaptureOptions }
  | { type: 'pickPhoto'; requestId: string; options?: CameraCaptureOptions }
  | { type: 'getCurrentLocation'; requestId: string; options?: LocationOptions }
  | {
      type: 'readVital';
      requestId: string;
      vitalTypeCd: VitalTypeCd;
    }
  | { type: 'checkBiometricAvailable'; requestId: string }
  | {
      type: 'authenticateBiometric';
      requestId: string;
      options?: BiometricAuthOptions;
    }
  | {
      type: 'speakText';
      requestId: string;
      text: string;
      rate?: number;
    }
  | { type: 'stopSpeech'; requestId: string }
  | { type: 'pauseSpeech'; requestId: string }
  | { type: 'resumeSpeech'; requestId: string };

/** RN → SPA 응답 이벤트 (cama-native detail.type) */
export type NativeBridgeResponseType =
  | 'stepCount'
  | 'fcmToken'
  | 'capabilities'
  | 'cameraCapture'
  | 'location'
  | 'vitalReading'
  | 'biometric'
  | 'speech';

export type NativeBridgeResponseBase = {
  requestId: string;
  ok: boolean;
  error?: NativeBridgeErrorCode | string;
};
