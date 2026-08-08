import type {
  FoodCatalogDto,
  FoodClassDto,
  FoodSearchQuery,
  MealDailySummaryDto,
  MealFeedbackRequest,
  MealLogDto,
  MealLogQuery,
  MealLogRequest,
  MealLogSummaryDto,
} from "@/apis/types/nutrition.types";
import { api } from "../../client";
import type { ApiResponse } from "../../types";

/**
 * 음식 사진 칼로리 기록 API.
 *
 * 식사 기록은 개인 데이터이므로 서버에 webview 미인증 미러가 없다.
 * 모든 호출이 JWT(api_key 헤더)를 요구한다.
 */

/**
 * 저장 없이 정본 kcal 계산 — review 화면에서 항목을 바꿀 때마다 호출한다.
 * POST /api/nutrition/meal/estimate
 */
export const estimateMeal = async (
  params: MealLogRequest,
): Promise<ApiResponse<MealLogDto>> => {
  return api.post("api/nutrition/meal/estimate", { json: params }).json();
};

/**
 * 식사 기록 저장. clientLogId 가 멱등 키이므로 재전송이 안전하다.
 * POST /api/nutrition/meal
 */
export const saveMeal = async (
  params: MealLogRequest,
): Promise<ApiResponse<MealLogDto>> => {
  return api.post("api/nutrition/meal", { json: params }).json();
};

/**
 * 식사 기록 수정 (서버가 항목을 다시 계산한다)
 * PUT /api/nutrition/meal/{seq}
 */
export const updateMeal = async (
  seq: number,
  params: MealLogRequest,
): Promise<ApiResponse<MealLogDto>> => {
  return api.put(`api/nutrition/meal/${seq}`, { json: params }).json();
};

/** GET /api/nutrition/meal/{seq} */
export const fetchMealDetail = async (
  seq: number,
): Promise<ApiResponse<MealLogDto>> => {
  return api.get(`api/nutrition/meal/${seq}`).json();
};

/** POST /api/nutrition/meal/delete */
export const deleteMeal = async (
  seq: number,
): Promise<ApiResponse<boolean>> => {
  return api.post("api/nutrition/meal/delete", { json: { seq } }).json();
};

/** POST /api/nutrition/mealList */
export const fetchMealList = async (
  params: MealLogQuery,
): Promise<ApiResponse<MealLogSummaryDto[]>> => {
  return api.post("api/nutrition/mealList", { json: params }).json();
};

/** POST /api/nutrition/mealDailySummary */
export const fetchMealDailySummary = async (
  params: MealLogQuery,
): Promise<ApiResponse<MealDailySummaryDto[]>> => {
  return api.post("api/nutrition/mealDailySummary", { json: params }).json();
};

/**
 * 앱 번들 catalog 갱신. since 에 보유 중인 catalogVersion 을 주면 델타만 받는다.
 * GET /api/nutrition/catalog
 */
export const fetchFoodCatalog = async (
  since?: string,
): Promise<ApiResponse<FoodCatalogDto>> => {
  return api
    .get("api/nutrition/catalog", {
      searchParams: since ? { since } : undefined,
    })
    .json();
};

/**
 * 수동 추가·후보 교체 폴백용 검색
 * POST /api/nutrition/food/search
 */
export const searchFood = async (
  params: FoodSearchQuery,
): Promise<ApiResponse<FoodClassDto[]>> => {
  return api.post("api/nutrition/food/search", { json: params }).json();
};

/**
 * 오분류 피드백. 모델 재학습 데이터로 축적된다.
 * POST /api/nutrition/meal/feedback
 */
export const saveMealFeedback = async (
  params: MealFeedbackRequest,
): Promise<ApiResponse<{ seq: number }>> => {
  return api.post("api/nutrition/meal/feedback", { json: params }).json();
};
