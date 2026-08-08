import { saveMeal } from "@/apis/api/webview/nutrition";
import {
  dequeueMeal,
  dueMealQueueItems,
  markMealAttemptFailed,
  mealQueueSize,
} from "@/lib/nutrition/mealQueue";

export type MealQueueFlushResult = {
  /** 서버 저장에 성공해 큐에서 제거된 건수 */
  saved: number;
  /** 재시도 예약된 건수 */
  retryScheduled: number;
  /** 최대 시도 초과 또는 영구 오류로 폐기된 건수 */
  dropped: number;
  /** 처리 후 남은 큐 길이 */
  remaining: number;
};

function extractStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }
  const direct = (error as { status?: unknown }).status;
  if (typeof direct === "number") {
    return direct;
  }
  const response = (error as { response?: { status?: unknown } }).response;
  if (response && typeof response.status === "number") {
    return response.status;
  }
  return undefined;
}

/**
 * 4xx 는 요청 자체가 잘못된 것이므로 재시도해도 통과하지 않는다.
 * 401 은 인터셉터가 로그인 화면으로 보내므로 큐를 유지한다.
 */
function isPermanentFailure(error: unknown): boolean {
  const status = extractStatus(error);
  if (status === undefined || status === 401) {
    return false;
  }
  return status >= 400 && status < 500;
}

/**
 * 큐에 남은 식사 기록을 순차 전송한다.
 * 병렬 전송은 서버 유니크 제약과 경쟁하므로 하지 않는다.
 */
export async function flushMealQueue(): Promise<MealQueueFlushResult> {
  const pending = dueMealQueueItems();
  let saved = 0;
  let retryScheduled = 0;
  let dropped = 0;

  for (const entry of pending) {
    try {
      const response = await saveMeal(entry.payload);
      if (response.success) {
        dequeueMeal(entry.clientLogId);
        saved += 1;
        continue;
      }
      const result = markMealAttemptFailed(
        entry.clientLogId,
        response.error?.message ?? "save_failed",
      );
      if (result.dropped) {
        dropped += 1;
      } else {
        retryScheduled += 1;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown";
      if (isPermanentFailure(error)) {
        dequeueMeal(entry.clientLogId);
        dropped += 1;
        continue;
      }
      const result = markMealAttemptFailed(entry.clientLogId, message);
      if (result.dropped) {
        dropped += 1;
      } else {
        retryScheduled += 1;
      }
    }
  }

  return { saved, retryScheduled, dropped, remaining: mealQueueSize() };
}
