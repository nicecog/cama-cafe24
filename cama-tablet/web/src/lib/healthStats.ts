import type { HeartRatePoint, StepDaily } from "../types/healthData";

const STEP_GOAL = 8000;

export function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.date.localeCompare(b.date));
}

export function computeStepStats(steps: StepDaily[]) {
  if (steps.length === 0) {
    return { today: 0, avg: 0, max: 0, total: 0, goalDays: 0, days: 0 };
  }
  const sorted = sortByDate(steps);
  const values = sorted.map((s) => s.steps);
  const total = values.reduce((a, b) => a + b, 0);
  return {
    today: sorted[sorted.length - 1]?.steps ?? 0,
    avg: Math.round(total / values.length),
    max: Math.max(...values),
    total,
    goalDays: values.filter((v) => v >= STEP_GOAL).length,
    days: values.length,
  };
}

export function getPeriodLabel(
  steps: StepDaily[],
  heart: HeartRatePoint[],
  periodFrom?: string,
  periodTo?: string,
): string {
  if (periodFrom && periodTo) return `${periodFrom} ~ ${periodTo}`;

  const dates = [
    ...steps.map((s) => s.date),
    ...heart.map((h) => h.date).filter(Boolean) as string[],
  ].sort();

  if (dates.length === 0) return "기간 정보 없음";
  if (dates.length === 1) return dates[0];
  return `${dates[0]} ~ ${dates[dates.length - 1]}`;
}

/** 심박 차트용 — date 우선, 없으면 time 라벨 사용 */
export function normalizeHeartRateSeries(history: HeartRatePoint[], latestBpm?: number) {
  if (history.length === 0) {
    if (latestBpm == null) return [];
    return [{ label: "현재", bpm: latestBpm }];
  }
  return history.map((h) => ({
    label: h.date ?? h.time ?? "-",
    bpm: h.bpm,
  }));
}

export function computeHeartRateStats(history: HeartRatePoint[], latestBpm?: number) {
  const values = history.map((h) => h.bpm);
  if (values.length === 0 && latestBpm != null) {
    return { current: latestBpm, avg: latestBpm, min: latestBpm, max: latestBpm };
  }
  if (values.length === 0) {
    return { current: 0, avg: 0, min: 0, max: 0 };
  }
  const sum = values.reduce((a, b) => a + b, 0);
  return {
    current: latestBpm ?? values[values.length - 1],
    avg: Math.round(sum / values.length),
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

export { STEP_GOAL };
