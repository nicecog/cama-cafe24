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
export type FoodVisionProfile = '416-int8' | '320-int8';

export type FoodVisionSource = 'camera' | 'library';

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
  | {
      type: 'readVitalSamples';
      requestId: string;
      vitalTypeCd: VitalTypeCd;
      daysBack?: number;
    }
  | { type: 'checkBiometricAvailable'; requestId: string }
  | {
      type: 'authenticateBiometric';
      requestId: string;
      options?: BiometricAuthOptions;
    }
  | { type: 'storeBiometricSecret'; requestId: string; secret: string }
  | { type: 'getBiometricSecret'; requestId: string }
  | { type: 'clearBiometricSecret'; requestId: string }
  | { type: 'hasBiometricSecret'; requestId: string }
  | { type: 'getDeviceId'; requestId: string }
  | {
      type: 'speakText';
      requestId: string;
      text: string;
      rate?: number;
    }
  | { type: 'stopSpeech'; requestId: string }
  | { type: 'pauseSpeech'; requestId: string }
  | { type: 'resumeSpeech'; requestId: string }
  | { type: 'openHealthConnectSettings'; requestId: string }
  | {
      type: 'checkSpeechRecognitionAvailable';
      requestId: string;
    }
  | {
      type: 'startSpeechRecognition';
      requestId: string;
      options?: SpeechRecognitionOptions;
    }
  | { type: 'stopSpeechRecognition'; requestId: string }
  | { type: 'cancelSpeechRecognition'; requestId: string }
  | { type: 'scanTabletQr'; requestId: string }
  | {
      type: 'sendTabletHealthData';
      requestId: string;
      qrPayload: Record<string, unknown>;
      healthData: Record<string, unknown>;
    }
  | {
      type: 'analyzeFoodImage';
      requestId: string;
      options?: FoodAnalysisOptions;
    }
  | { type: 'getFoodVisionInfo'; requestId: string };

/** RN → SPA 응답 이벤트 (cama-native detail.type) */
export type NativeBridgeResponseType =
  | 'stepCount'
  | 'fcmToken'
  | 'capabilities'
  | 'cameraCapture'
  | 'location'
  | 'vitalReading'
  | 'vitalSamples'
  | 'biometric'
  | 'deviceId'
  | 'speech'
  | 'speechRecognition'
  | 'healthConnectSettings'
  | 'tabletQrScan'
  | 'tabletHealthDataSent'
  | 'foodImageAnalysis'
  | 'foodVisionInfo';

export type NativeBridgeResponseBase = {
  requestId: string;
  ok: boolean;
  error?: NativeBridgeErrorCode | string;
};
