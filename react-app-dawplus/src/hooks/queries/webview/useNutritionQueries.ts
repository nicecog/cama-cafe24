import { useQuery } from "@tanstack/react-query";
import {
  fetchFoodCatalog,
  fetchMealDailySummary,
  fetchMealDetail,
  fetchMealList,
  searchFood,
} from "@/apis/api/webview/nutrition";
import type { MealLogQuery } from "@/apis/types/nutrition.types";
import { queryKeys } from "@/lib/queryClient";

export const useMealList = (params: MealLogQuery, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.webview.nutrition.mealList(
      params.fromDate,
      params.toDate,
      params.mealTypeCd,
    ),
    queryFn: () => fetchMealList(params),
    enabled,
    select: (data) => data.response ?? [],
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useMealDailySummary = (params: MealLogQuery, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.webview.nutrition.mealDailySummary(
      params.fromDate,
      params.toDate,
    ),
    queryFn: () => fetchMealDailySummary(params),
    enabled,
    select: (data) => data.response ?? [],
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useMealDetail = (seq: number | undefined) => {
  return useQuery({
    queryKey: queryKeys.webview.nutrition.mealDetail(seq ?? 0),
    queryFn: () => fetchMealDetail(seq as number),
    enabled: Boolean(seq),
    select: (data) => data.response ?? null,
  });
};

/** 수동 추가·후보 교체 폴백 검색. 2자 이상부터 조회한다 */
export const useFoodSearch = (keyword: string, limit = 20) => {
  const trimmed = keyword.trim();
  return useQuery({
    queryKey: queryKeys.webview.nutrition.foodSearch(trimmed),
    queryFn: () => searchFood({ keyword: trimmed, limit }),
    enabled: trimmed.length >= 2,
    select: (data) => data.response ?? [],
    staleTime: 1000 * 60 * 5,
  });
};

/** 앱 번들 catalog 델타. 서버 catalogVersion 확인용으로도 쓴다 */
export const useFoodCatalog = (since?: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.webview.nutrition.catalog(since),
    queryFn: () => fetchFoodCatalog(since),
    enabled,
    select: (data) => data.response ?? null,
    staleTime: 1000 * 60 * 60,
  });
};
