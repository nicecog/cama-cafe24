/** Jest/타입체크용 fallback — 런타임은 StepCounter.ios.ts / StepCounter.android.ts 사용 */
export async function ensureActivityRecognitionPermission(): Promise<boolean> {
  return false;
}

export async function getTodayStepCountFromDevice(): Promise<number> {
  throw new Error('STEP_COUNTER_UNAVAILABLE');
}
