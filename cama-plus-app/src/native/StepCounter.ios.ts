import { NativeModules } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

type StepCounterModule = {
  getTodayStepCount: () => Promise<number>;
  requestHealthKitAuthorization?: () => Promise<boolean>;
};

const NativeStep = NativeModules.CamaStepCounter as
  | StepCounterModule
  | undefined;

async function ensureMotionPermission(): Promise<boolean> {
  const status = await check(PERMISSIONS.IOS.MOTION);
  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
    return true;
  }
  if (status === RESULTS.BLOCKED || status === RESULTS.UNAVAILABLE) {
    return false;
  }
  const result = await request(PERMISSIONS.IOS.MOTION);
  return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
}

async function ensureHealthKitPermission(): Promise<boolean> {
  if (!NativeStep?.requestHealthKitAuthorization) {
    return true;
  }
  try {
    await NativeStep.requestHealthKitAuthorization();
    return true;
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code ?? '';
    if (code === 'ACTIVITY_RECOGNITION_DENIED' || code === 'NO_STEP_SENSOR') {
      return false;
    }
    return true;
  }
}

/** iOS HealthKit + CMPedometer fallback 권한 */
export async function ensureActivityRecognitionPermission(): Promise<boolean> {
  const healthOk = await ensureHealthKitPermission();
  if (!healthOk) {
    return false;
  }
  return ensureMotionPermission();
}

/** 오늘 걸음수 (iOS HealthKit 우선, CMPedometer fallback) */
export async function getTodayStepCountFromDevice(): Promise<number> {
  if (!NativeStep?.getTodayStepCount) {
    throw new Error('STEP_COUNTER_UNAVAILABLE');
  }

  await ensureHealthKitPermission();
  await ensureMotionPermission();

  const steps = await NativeStep.getTodayStepCount();
  if (!Number.isFinite(steps) || steps < 0) {
    throw new Error('STEP_COUNTER_INVALID');
  }
  return Math.floor(steps);
}
