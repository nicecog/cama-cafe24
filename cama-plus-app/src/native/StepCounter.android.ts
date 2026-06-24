import { NativeModules, PermissionsAndroid, Platform } from 'react-native';

type StepCounterModule = {
  getTodayStepCount: () => Promise<number>;
};

const NativeStep = NativeModules.CamaStepCounter as
  | StepCounterModule
  | undefined;

export async function ensureActivityRecognitionPermission(): Promise<boolean> {
  if (Platform.OS !== 'android' || Platform.Version < 29) {
    return true;
  }
  const granted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
  );
  if (granted) {
    return true;
  }
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

/** 오늘 걸음수 (Android STEP_COUNTER). 미지원/거부 시 reject */
export async function getTodayStepCountFromDevice(): Promise<number> {
  if (Platform.OS !== 'android' || !NativeStep?.getTodayStepCount) {
    throw new Error('STEP_COUNTER_UNAVAILABLE');
  }
  const ok = await ensureActivityRecognitionPermission();
  if (!ok) {
    throw new Error('ACTIVITY_RECOGNITION_DENIED');
  }
  const steps = await NativeStep.getTodayStepCount();
  if (!Number.isFinite(steps) || steps < 0) {
    throw new Error('STEP_COUNTER_INVALID');
  }
  return Math.floor(steps);
}
