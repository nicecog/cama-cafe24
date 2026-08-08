import {
  MEAL_LIMITS,
  type MealClientMeta,
  type MealLogRequest,
  type MealSourceCd,
  type MealTypeCd,
} from "@/apis/types/nutrition.types";
import type {
  FoodCandidate,
  FoodImageAnalysisResult,
} from "@/lib/webview/nativeBridge.types";

/**
 * review 화면이 편집하는 로컬 초안.
 *
 * kcal 은 담지 않는다. 화면에 표시하는 kcal 은 서버 estimate 응답(정본) 또는
 * 온디바이스 미리보기(`kcalPreview`) 중 하나이며, 초안은 "무엇을 얼마나" 만 관리한다.
 */
export type MealDraftItem = {
  /** 화면 편집용 로컬 식별자 (서버에 전송하지 않음) */
  uid: string;
  classKey: string;
  nameKo?: string;
  confidence: number;
  quantity: number;
  portionFactor: number;
  servingG?: number;
  /** 온디바이스 계산값. 오프라인 폴백 표시에만 쓴다 */
  kcalPreview?: number;
  bbox?: [number, number, number, number];
  candidates?: FoodCandidate[];
  /** 사용자가 후보/검색으로 음식을 바꿨을 때 모델 원본 예측 */
  originalClassKey?: string;
  isUserCorrected: boolean;
};

export type MealDraft = {
  clientLogId: string;
  mealTypeCd: MealTypeCd;
  /** ISO-8601 with offset */
  eatenAt: string;
  sourceCd: MealSourceCd;
  memo?: string;
  clientMeta?: MealClientMeta;
  items: MealDraftItem[];
};

export function createClientLogId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // 서버가 UUID 형식을 검증하므로 폴백도 v4 형태를 유지한다
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === "x" ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}

function createUid(): string {
  return `item-${Math.random().toString(36).slice(2, 10)}`;
}

/** 촬영 시각 기준으로 식사 구분을 추정한다 */
export function guessMealType(at: Date = new Date()): MealTypeCd {
  const hour = at.getHours();
  if (hour >= 5 && hour < 11) {
    return "BREAKFAST";
  }
  if (hour >= 11 && hour < 15) {
    return "LUNCH";
  }
  if (hour >= 17 && hour < 22) {
    return "DINNER";
  }
  return "SNACK";
}

/** 서버가 파싱 가능한 ISO-8601 (offset 포함) 문자열 */
export function toIsoWithOffset(date: Date): string {
  const pad = (value: number, size = 2) => String(value).padStart(size, "0");
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const absOffset = Math.abs(offsetMin);
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(Math.floor(absOffset / 60))}:${pad(absOffset % 60)}`
  );
}

/** 네이티브 추론 결과를 편집 가능한 초안으로 변환한다 */
export function createDraftFromAnalysis(
  analysis: FoodImageAnalysisResult,
): MealDraft {
  const capturedAt = new Date(analysis.capturedAt);
  const eatenAtDate = Number.isNaN(capturedAt.getTime())
    ? new Date()
    : capturedAt;

  return {
    clientLogId: createClientLogId(),
    mealTypeCd: guessMealType(eatenAtDate),
    eatenAt: toIsoWithOffset(eatenAtDate),
    sourceCd: "ONDEVICE",
    clientMeta: {
      modelVersion: analysis.modelVersion,
      catalogVersion: analysis.catalogVersion,
      profile: analysis.profile,
      inferenceMs: analysis.inferenceMs,
    },
    items: analysis.items.slice(0, MEAL_LIMITS.maxItems).map((item) => ({
      uid: createUid(),
      classKey: item.classKey,
      nameKo: item.nameKo,
      confidence: item.confidence,
      quantity: clampQuantity(item.quantity),
      portionFactor: 1,
      servingG: item.servingG,
      kcalPreview: item.kcalPreview,
      bbox: item.bbox,
      candidates: item.candidates,
      isUserCorrected: false,
    })),
  };
}

/** 사진 없이 직접 입력하는 초안 */
export function createManualDraft(): MealDraft {
  const now = new Date();
  return {
    clientLogId: createClientLogId(),
    mealTypeCd: guessMealType(now),
    eatenAt: toIsoWithOffset(now),
    sourceCd: "MANUAL",
    items: [],
  };
}

export function createDraftItem(
  classKey: string,
  nameKo?: string,
  servingG?: number,
): MealDraftItem {
  return {
    uid: createUid(),
    classKey,
    nameKo,
    confidence: 1,
    quantity: 1,
    portionFactor: 1,
    servingG,
    isUserCorrected: true,
  };
}

export function clampQuantity(value: number | undefined): number {
  if (!value || Number.isNaN(value)) {
    return MEAL_LIMITS.minQuantity;
  }
  return Math.min(
    MEAL_LIMITS.maxQuantity,
    Math.max(MEAL_LIMITS.minQuantity, Math.round(value)),
  );
}

export function clampPortionFactor(value: number | undefined): number {
  if (!value || Number.isNaN(value)) {
    return 1;
  }
  return Math.min(
    MEAL_LIMITS.maxPortionFactor,
    Math.max(MEAL_LIMITS.minPortionFactor, value),
  );
}

/** 초안을 estimate·save 공통 요청 본문으로 변환한다 */
export function toMealLogRequest(draft: MealDraft): MealLogRequest {
  return {
    clientLogId: draft.clientLogId,
    mealTypeCd: draft.mealTypeCd,
    eatenAt: draft.eatenAt,
    sourceCd: draft.sourceCd,
    memo: draft.memo,
    clientMeta: draft.clientMeta,
    items: draft.items.map((item) => ({
      classKey: item.classKey,
      confidence: item.confidence,
      portionFactor: clampPortionFactor(item.portionFactor),
      quantity: clampQuantity(item.quantity),
      isUserCorrected: item.isUserCorrected,
      originalClassKey: item.originalClassKey,
      clientKcalPreview: item.kcalPreview,
      bbox: item.bbox ? [...item.bbox] : undefined,
    })),
  };
}

/**
 * 서버 응답이 없을 때 표시할 온디바이스 합계.
 * `kcalPreview` 는 1인분 기준이므로 인분·수량을 곱한다.
 */
export function sumPreviewKcal(items: MealDraftItem[]): number | undefined {
  const known = items.filter((item) => typeof item.kcalPreview === "number");
  if (known.length === 0) {
    return undefined;
  }
  const total = known.reduce(
    (sum, item) =>
      sum +
      (item.kcalPreview ?? 0) *
        clampPortionFactor(item.portionFactor) *
        clampQuantity(item.quantity),
    0,
  );
  return Math.round(total);
}

/** estimate 재호출이 필요한 변경만 담은 캐시 키 */
export function draftEstimateKey(draft: MealDraft): string {
  return JSON.stringify({
    mealTypeCd: draft.mealTypeCd,
    items: draft.items.map((item) => [
      item.classKey,
      clampPortionFactor(item.portionFactor),
      clampQuantity(item.quantity),
      item.isUserCorrected,
    ]),
  });
}
