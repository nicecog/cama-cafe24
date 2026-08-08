import { NativeModules, Platform } from 'react-native';

import type {
  BiometricAuthOptions,
  BiometricAuthResult,
  BiometricAvailability,
  CameraCaptureOptions,
  CameraCaptureResult,
  DeviceCapabilities,
  FoodAnalysisOptions,
  FoodImageAnalysisResult,
  FoodVisionInfo,
  LocationOptions,
  LocationResult,
  SpeechRecognitionAvailability,
  SpeechRecognitionOptions,
  VitalReadingResult,
  VitalSamplesResult,
  VitalTypeCd,
} from '@/constants/nativeBridge.types';
import { NATIVE_BRIDGE_ERRORS } from '@/constants/nativeBridge.types';
import { NativeBridgeError, toNativeBridgeError } from '@/native/bridgeErrors';

type CamaNativeBridgeNative = {
  getCapabilities: () => Promise<DeviceCapabilities>;
  capturePhoto: (options: CameraCaptureOptions) => Promise<CameraCaptureResult>;
  pickPhotoFromLibrary: (
    options: CameraCaptureOptions,
  ) => Promise<CameraCaptureResult>;
  getCurrentLocation: (options: LocationOptions) => Promise<LocationResult>;
  readVital: (vitalTypeCd: VitalTypeCd) => Promise<VitalReadingResult>;
  readVitalSamples: (
    vitalTypeCd: VitalTypeCd,
    daysBack: number,
  ) => Promise<VitalSamplesResult>;
  isBiometricAvailable: () => Promise<BiometricAvailability>;
  authenticateBiometric: (
    options: BiometricAuthOptions,
  ) => Promise<BiometricAuthResult>;
  storeBiometricSecret: (secret: string) => Promise<{ stored: boolean }>;
  getBiometricSecret: () => Promise<{ secret: string }>;
  clearBiometricSecret: () => Promise<{ cleared: boolean }>;
  hasBiometricSecret: () => Promise<{ hasSecret: boolean }>;
  getDeviceId: () => Promise<{ deviceId: string }>;
  speakText: (text: string, rate: number) => Promise<boolean>;
  stopSpeech: () => Promise<boolean>;
  pauseSpeech: () => Promise<boolean>;
  resumeSpeech: () => Promise<boolean>;
  openHealthConnectSettings: () => Promise<boolean>;
  checkSpeechRecognitionAvailable: () => Promise<SpeechRecognitionAvailability>;
  startSpeechRecognition: (
    options: SpeechRecognitionOptions,
  ) => Promise<boolean>;
  stopSpeechRecognition: () => Promise<boolean>;
  cancelSpeechRecognition: () => Promise<boolean>;
  analyzeFoodImage: (
    options: FoodAnalysisOptions,
  ) => Promise<FoodImageAnalysisResult>;
  getFoodVisionInfo: () => Promise<FoodVisionInfo>;
};

const NativeBridge = NativeModules.CamaNativeBridge as
  | CamaNativeBridgeNative
  | undefined;

function stubCapability(implemented = false) {
  return { available: false, implemented };
}

/** 네이티브 모듈 미연결 시 JS fallback capabilities */
export function getJsFallbackCapabilities(): DeviceCapabilities {
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';
  return {
    platform,
    camera: stubCapability(),
    photoLibrary: stubCapability(),
    location: stubCapability(),
    biometrics: stubCapability(),
    stepCounter: {
      available: true,
      implemented: true,
      permissionRequired:
        platform === 'android'
          ? ['android.permission.ACTIVITY_RECOGNITION']
          : ['NSMotionUsageDescription', 'NSHealthShareUsageDescription'],
    },
    speechRecognition: stubCapability(),
    foodVision: stubCapability(),
    vitals: {
      HEART_RATE: stubCapability(),
      SPO2: stubCapability(),
      BP_SYSTOLIC: stubCapability(),
      BP_DIASTOLIC: stubCapability(),
      BODY_TEMP: stubCapability(),
      RESPIRATORY_RATE: stubCapability(),
    },
  };
}

async function invokeNative<T>(
  method: keyof CamaNativeBridgeNative,
  ...args: unknown[]
): Promise<T> {
  const fn = NativeBridge?.[method];
  if (typeof fn !== 'function') {
    throw new NativeBridgeError(NATIVE_BRIDGE_ERRORS.NOT_IMPLEMENTED);
  }
  try {
    return (await (fn as (...a: unknown[]) => Promise<T>).apply(NativeBridge, args));
  } catch (error) {
    throw toNativeBridgeError(error);
  }
}

export async function getDeviceCapabilities(): Promise<DeviceCapabilities> {
  try {
    return await invokeNative<DeviceCapabilities>('getCapabilities');
  } catch (error) {
    if (
      error instanceof NativeBridgeError &&
      error.code === NATIVE_BRIDGE_ERRORS.NOT_IMPLEMENTED
    ) {
      return getJsFallbackCapabilities();
    }
    throw error;
  }
}

export function capturePhoto(
  options: CameraCaptureOptions = {},
): Promise<CameraCaptureResult> {
  return invokeNative('capturePhoto', options);
}

export function pickPhotoFromLibrary(
  options: CameraCaptureOptions = {},
): Promise<CameraCaptureResult> {
  return invokeNative('pickPhotoFromLibrary', options);
}

export function getCurrentLocation(
  options: LocationOptions = {},
): Promise<LocationResult> {
  return invokeNative('getCurrentLocation', options);
}

export function readVital(vitalTypeCd: VitalTypeCd): Promise<VitalReadingResult> {
  return invokeNative('readVital', vitalTypeCd);
}

export function readVitalSamples(
  vitalTypeCd: VitalTypeCd,
  daysBack = 1,
): Promise<VitalSamplesResult> {
  return invokeNative('readVitalSamples', vitalTypeCd, daysBack);
}

export function isBiometricAvailable(): Promise<BiometricAvailability> {
  return invokeNative('isBiometricAvailable');
}

export function authenticateBiometric(
  options: BiometricAuthOptions = {},
): Promise<BiometricAuthResult> {
  return invokeNative('authenticateBiometric', options);
}

export function storeBiometricSecret(
  secret: string,
): Promise<{ stored: boolean }> {
  return invokeNative('storeBiometricSecret', secret);
}

export function getBiometricSecret(): Promise<{ secret: string }> {
  return invokeNative('getBiometricSecret');
}

export function clearBiometricSecret(): Promise<{ cleared: boolean }> {
  return invokeNative('clearBiometricSecret');
}

export function hasBiometricSecret(): Promise<{ hasSecret: boolean }> {
  return invokeNative('hasBiometricSecret');
}

export function getDeviceId(): Promise<{ deviceId: string }> {
  return invokeNative('getDeviceId');
}

export function speakText(text: string, rate = 0.9): Promise<boolean> {
  return invokeNative('speakText', text, rate);
}

export function stopSpeech(): Promise<boolean> {
  return invokeNative('stopSpeech');
}

export function pauseSpeech(): Promise<boolean> {
  return invokeNative('pauseSpeech');
}

export function resumeSpeech(): Promise<boolean> {
  return invokeNative('resumeSpeech');
}

export function openHealthConnectSettings(): Promise<boolean> {
  return invokeNative('openHealthConnectSettings');
}

export function checkSpeechRecognitionAvailable(): Promise<SpeechRecognitionAvailability> {
  return invokeNative('checkSpeechRecognitionAvailable');
}

export function startSpeechRecognition(
  options: SpeechRecognitionOptions = {},
): Promise<boolean> {
  return invokeNative('startSpeechRecognition', options);
}

export function stopSpeechRecognition(): Promise<boolean> {
  return invokeNative('stopSpeechRecognition');
}

export function cancelSpeechRecognition(): Promise<boolean> {
  return invokeNative('cancelSpeechRecognition');
}

/**
 * 촬영·온디바이스 추론·클래스 집계를 네이티브에서 한 번에 수행한다.
 * 원본 이미지는 네이티브 임시 파일로만 존재하고 JS·서버로 전달되지 않는다.
 */
export function analyzeFoodImage(
  options: FoodAnalysisOptions = {},
): Promise<FoodImageAnalysisResult> {
  return invokeNative('analyzeFoodImage', options);
}

export function getFoodVisionInfo(): Promise<FoodVisionInfo> {
  return invokeNative('getFoodVisionInfo');
}
