jest.mock('react-native-permissions', () => ({
  PERMISSIONS: { IOS: { MOTION: 'ios.permission.MOTION' } },
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    BLOCKED: 'blocked',
    DENIED: 'denied',
    GRANTED: 'granted',
    LIMITED: 'limited',
  },
  check: jest.fn(async () => 'granted'),
  request: jest.fn(async () => 'granted'),
}));

jest.mock('react-native', () => ({
  NativeModules: {
    CamaStepCounter: {
      getTodayStepCount: jest.fn(async () => 4321),
      requestHealthKitAuthorization: jest.fn(async () => true),
    },
  },
  Platform: { OS: 'ios' },
}));

import {
  ensureActivityRecognitionPermission,
  getTodayStepCountFromDevice,
} from '@/native/StepCounter';

describe('StepCounter.ios bridge', () => {
  it('ensureActivityRecognitionPermission resolves true when permissions granted', async () => {
    await expect(ensureActivityRecognitionPermission()).resolves.toBe(true);
  });

  it('getTodayStepCountFromDevice returns floored step count from native module', async () => {
    await expect(getTodayStepCountFromDevice()).resolves.toBe(4321);
  });
});
