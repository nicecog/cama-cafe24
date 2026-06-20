import { NativeModules, Platform } from 'react-native';

import type {
  BiometricAuthOptions,
  BiometricAuthResult,
  BiometricAvailability,
  CameraCaptureOptions,
  CameraCaptureResult,
  DeviceCapabilities,
  LocationOptions,
  LocationResult,
  VitalReadingResult,
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
  isBiometricAvailable: () => Promise<BiometricAvailability>;
  authenticateBiometric: (
    options: BiometricAuthOptions,
  ) => Promise<BiometricAuthResult>;
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
      available: platform === 'android',
      implemented: platform === 'android',
    },
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

export function isBiometricAvailable(): Promise<BiometricAvailability> {
  return invokeNative('isBiometricAvailable');
}

export function authenticateBiometric(
  options: BiometricAuthOptions = {},
): Promise<BiometricAuthResult> {
  return invokeNative('authenticateBiometric', options);
}
