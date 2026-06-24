jest.mock('react-native', () => ({
  NativeModules: {
    CamaStepCounter: {
      getTodayStepCount: jest.fn(async () => 8765),
    },
  },
  Platform: { OS: 'android', Version: 33 },
  PermissionsAndroid: {
    PERMISSIONS: { ACTIVITY_RECOGNITION: 'android.permission.ACTIVITY_RECOGNITION' },
    RESULTS: { GRANTED: 'granted', DENIED: 'denied' },
    check: jest.fn(async () => true),
    request: jest.fn(async () => 'granted'),
  },
}));

import {
  ensureActivityRecognitionPermission,
  getTodayStepCountFromDevice,
} from '@/native/StepCounter.android';

describe('StepCounter.android bridge', () => {
  it('ensureActivityRecognitionPermission resolves true when granted', async () => {
    await expect(ensureActivityRecognitionPermission()).resolves.toBe(true);
  });

  it('getTodayStepCountFromDevice returns floored step count from native module', async () => {
    await expect(getTodayStepCountFromDevice()).resolves.toBe(8765);
  });

  it('getTodayStepCountFromDevice rejects when permission denied', async () => {
    const { PermissionsAndroid } = require('react-native');
    PermissionsAndroid.check.mockResolvedValueOnce(false);
    PermissionsAndroid.request.mockResolvedValueOnce('denied');

    await expect(getTodayStepCountFromDevice()).rejects.toThrow(
      'ACTIVITY_RECOGNITION_DENIED',
    );
  });
});
