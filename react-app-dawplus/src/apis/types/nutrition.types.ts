/**
 * 음식 사진 칼로리 기록 API 타입
 * cama-plus-server `dto/nutrition` 과 1:1 대응한다.
 */

export type MealTypeCd = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

export type MealSourceCd = "ONDEVICE" | "MANUAL";

export type NutritionSourceCd = "MFDS" | "CLASS_FALLBACK" | "NONE";

/** 온디바이스 추론 메타. 서버는 저장만 하고 계산에 쓰지 않는다 */
export interface MealClientMeta {
  modelVersion?: string;
  catalogVersion?: string;
  profile?: string;
  inferenceMs?: number;
  appVersion?: string;
}

export interface MealLogItemRequest {
  classKey: string;
  /** 0 ~ 1 */
  confidence?: number;
  /** 0.25 ~ 5.0 */
  portionFactor?: number;
  /** 1 ~ 20 */
  quantity?: number;
  isUserCorrected?: boolean;
  /** 사용자가 후보로 교체한 경우 모델 원본 예측값 */
  originalClassKey?: string;
  /** 앱 미리보기 kcal. 서버 계산에 사용되지 않는다 */
  clientKcalPreview?: number;
  /** [x, y, w, h] 정규화 좌표 */
  bbox?: number[];
}

export interface MealLogRequest {
  /** estimate 에서는 생략 가능. 저장 시 멱등 키로 쓰인다 */
  clientLogId?: string;
  mealTypeCd: MealTypeCd;
  /** ISO-8601 (예: 2026-08-08T12:30:00+09:00) */
  eatenAt?: string;
  sourceCd?: MealSourceCd;
  memo?: string;
  clientMeta?: MealClientMeta;
  items: MealLogItemRequest[];
}

export interface MealLogItemDto {
  seq?: number;
  classKey: string;
  nameKo?: string;
  foodCode?: string;
  confidence?: number;
  portionFactor?: number;
  quantity?: number;
  gramsG?: number;
  kcal?: number;
  carbG?: number;
  proteinG?: number;
  fatG?: number;
  nutritionSourceCd?: NutritionSourceCd;
  /** 폴백 영양값 사용 여부 */
  estimated: boolean;
  userCorrected: boolean;
  originalClassKey?: string;
  displayOrder?: number;
}

export interface MealGuideDto {
  headline?: string;
  messages?: string[];
  /** 의료기기 오인 방지 고지. 항상 포함된다 */
  disclaimer?: string;
}

/** estimate 응답과 저장 응답이 동일 구조다. estimate 에서는 seq 가 null 이다 */
export interface MealLogDto {
  seq?: number;
  clientLogId?: string;
  mealTypeCd: MealTypeCd;
  /** yyyy-MM-dd HH:mm:ss (Asia/Seoul) */
  eatenAt?: string;
  sourceCd?: MealSourceCd;
  totalKcal?: number;
  totalCarbG?: number;
  totalProteinG?: number;
  totalFatG?: number;
  needsReview: boolean;
  nutritionVersion?: string;
  memo?: string;
  items: MealLogItemDto[];
  guide?: MealGuideDto;
}

export interface MealLogQuery {
  /** yyyy-MM-dd */
  fromDate?: string;
  /** yyyy-MM-dd (해당 일자 포함) */
  toDate?: string;
  mealTypeCd?: MealTypeCd;
  limit?: number;
}

export interface MealLogSummaryDto {
  seq: number;
  clientLogId?: string;
  mealTypeCd: MealTypeCd;
  eatenAt?: string;
  sourceCd?: MealSourceCd;
  totalKcal?: number;
  totalCarbG?: number;
  totalProteinG?: number;
  totalFatG?: number;
  needsReview: boolean;
  itemCount?: number;
  /** 대표 음식명 (쉼표 구분, 최대 3개) */
  itemNames?: string;
  createdAt?: string;
}

export interface MealDailySummaryDto {
  /** yyyy-MM-dd */
  mealDate: string;
  totalKcal?: number;
  totalCarbG?: number;
  totalProteinG?: number;
  totalFatG?: number;
  mealCount?: number;
}

/** catalog 항목. 영양값은 모두 100g 기준이다 */
export interface FoodClassDto {
  classId?: number;
  classKey: string;
  nameKo?: string;
  categoryNm?: string;
  servingG?: number;
  kcalPer100g?: number;
  carbPer100g?: number;
  proteinPer100g?: number;
  fatPer100g?: number;
}

export interface FoodCatalogDto {
  /** 1.0.{maxUpdatedAtEpochSeconds} — 단조 증가 토큰 */
  catalogVersion?: string;
  full: boolean;
  changed?: FoodClassDto[];
  /** 비활성화된 classKey 목록 */
  removed?: string[];
}

export interface FoodSearchQuery {
  keyword: string;
  limit?: number;
}

export interface MealFeedbackRequest {
  mealLogItemSeq?: number;
  predictedClass: string;
  correctedClass: string;
  modelVersion?: string;
  confidence?: number;
  memo?: string;
}

export const MEAL_TYPE_LABELS: Record<MealTypeCd, string> = {
  BREAKFAST: "아침",
  LUNCH: "점심",
  DINNER: "저녁",
  SNACK: "간식",
};

/** review 화면에서 "확인 필요"로 강조하는 기준 */
export const LOW_CONFIDENCE_THRESHOLD = 0.5;

/** 서버가 needsReview 플래그를 세우는 기준 (NutritionCalculator 와 동일) */
export const NEEDS_REVIEW_THRESHOLD = 0.35;

/** 서버 검증 한계값 (NutritionCalculator 와 동일) */
export const MEAL_LIMITS = {
  maxItems: 20,
  minPortionFactor: 0.25,
  maxPortionFactor: 5,
  minQuantity: 1,
  maxQuantity: 20,
} as const;

/** 인분 슬라이더 프리셋 */
export const PORTION_PRESETS = [0.5, 1, 1.5, 2] as const;
