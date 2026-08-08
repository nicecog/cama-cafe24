import type { MealLogRequest } from "@/apis/types/nutrition.types";

/**
 * 오프라인 식사 기록 큐.
 *
 * `clientLogId` 가 서버에서 (account_seq, client_log_id) 유니크 제약으로 멱등 키로 쓰이므로
 * 재전송이 중복 기록을 만들지 않는다. 따라서 "전송했는지 확실하지 않은" 항목도 그냥 다시 보내면 된다.
 */

const STORAGE_KEY = "cama.meal.queue";

export const MEAL_QUEUE_MAX_ATTEMPTS = 5;

const BASE_BACKOFF_MS = 5_000;
const MAX_BACKOFF_MS = 10 * 60_000;

export type QueuedMeal = {
  clientLogId: string;
  payload: MealLogRequest;
  createdAt: string;
  attempts: number;
  /** epoch ms. 이 시각 이후에 재전송한다 */
  nextAttemptAt: number;
  lastError?: string;
};

function isStorageAvailable(): boolean {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

export function readMealQueue(): QueuedMeal[] {
  if (!isStorageAvailable()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (entry): entry is QueuedMeal =>
        Boolean(entry) &&
        typeof entry.clientLogId === "string" &&
        Boolean(entry.payload),
    );
  } catch {
    return [];
  }
}

function writeMealQueue(queue: QueuedMeal[]): void {
  if (!isStorageAvailable()) {
    return;
  }
  try {
    if (queue.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // 저장 실패(용량 초과 등)는 무시한다. 큐는 최선 노력 보관이다
  }
}

/** 동일 clientLogId 는 덮어쓴다 (사용자가 같은 초안을 다시 저장한 경우) */
export function enqueueMeal(payload: MealLogRequest): QueuedMeal | null {
  if (!payload.clientLogId) {
    return null;
  }
  const entry: QueuedMeal = {
    clientLogId: payload.clientLogId,
    payload,
    createdAt: new Date().toISOString(),
    attempts: 0,
    nextAttemptAt: Date.now(),
  };
  const queue = readMealQueue().filter(
    (item) => item.clientLogId !== entry.clientLogId,
  );
  writeMealQueue([...queue, entry]);
  return entry;
}

export function dequeueMeal(clientLogId: string): void {
  writeMealQueue(
    readMealQueue().filter((item) => item.clientLogId !== clientLogId),
  );
}

export function clearMealQueue(): void {
  writeMealQueue([]);
}

export function mealQueueSize(): number {
  return readMealQueue().length;
}

/** 재전송 시각이 도래한 항목 */
export function dueMealQueueItems(now = Date.now()): QueuedMeal[] {
  return readMealQueue().filter((item) => item.nextAttemptAt <= now);
}

/** 전송 실패 기록. 최대 시도 횟수를 넘기면 큐에서 제거한다 */
export function markMealAttemptFailed(
  clientLogId: string,
  error?: string,
): { dropped: boolean; attempts: number } {
  const queue = readMealQueue();
  const target = queue.find((item) => item.clientLogId === clientLogId);
  if (!target) {
    return { dropped: true, attempts: 0 };
  }

  const attempts = target.attempts + 1;
  if (attempts >= MEAL_QUEUE_MAX_ATTEMPTS) {
    writeMealQueue(queue.filter((item) => item.clientLogId !== clientLogId));
    return { dropped: true, attempts };
  }

  const backoff = Math.min(
    MAX_BACKOFF_MS,
    BASE_BACKOFF_MS * 2 ** (attempts - 1),
  );
  writeMealQueue(
    queue.map((item) =>
      item.clientLogId === clientLogId
        ? {
            ...item,
            attempts,
            nextAttemptAt: Date.now() + backoff,
            lastError: error,
          }
        : item,
    ),
  );
  return { dropped: false, attempts };
}
