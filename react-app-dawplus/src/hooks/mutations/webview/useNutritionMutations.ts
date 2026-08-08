import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteMeal,
  estimateMeal,
  saveMeal,
  saveMealFeedback,
  updateMeal,
} from "@/apis/api/webview/nutrition";
import type {
  MealFeedbackRequest,
  MealLogDto,
  MealLogRequest,
} from "@/apis/types/nutrition.types";
import { enqueueMeal } from "@/lib/nutrition/mealQueue";
import { queryKeys } from "@/lib/queryClient";

/**
 * 저장 없이 정본 kcal 만 계산한다. review 화면에서 항목을 바꿀 때마다 호출한다.
 * 실패해도 화면은 온디바이스 미리보기로 동작하므로 오류를 던지되 상태만 노출한다.
 */
export const useEstimateMeal = () => {
  return useMutation({
    mutationFn: (params: MealLogRequest) => estimateMeal(params),
  });
};

export type SaveMealOutcome =
  | { status: "saved"; meal: MealLogDto }
  | { status: "queued"; reason: string };

/**
 * 식사 기록 저장. 네트워크 실패 시 오프라인 큐에 넣고 queued 로 알린다.
 * clientLogId 가 멱등 키이므로 나중에 재전송해도 중복 기록이 생기지 않는다.
 */
export const useSaveMeal = () => {
  const queryClient = useQueryClient();

  return useMutation<SaveMealOutcome, Error, MealLogRequest>({
    mutationFn: async (params) => {
      try {
        const response = await saveMeal(params);
        if (!response.success || !response.response) {
          throw new Error(response.error?.message ?? "save_failed");
        }
        return { status: "saved", meal: response.response };
      } catch (error) {
        const status = extractStatus(error);
        // 4xx 는 재전송해도 통과하지 않으므로 큐에 넣지 않고 그대로 실패시킨다
        if (status !== undefined && status >= 400 && status < 500) {
          throw error instanceof Error ? error : new Error("save_failed");
        }
        enqueueMeal(params);
        return {
          status: "queued",
          reason: error instanceof Error ? error.message : "network",
        };
      }
    },
    onSuccess: async (outcome) => {
      if (outcome.status === "saved") {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.webview.nutrition.all,
        });
      }
    },
  });
};

export const useUpdateMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ seq, params }: { seq: number; params: MealLogRequest }) =>
      updateMeal(seq, params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.webview.nutrition.all,
      });
    },
  });
};

export const useDeleteMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seq: number) => deleteMeal(seq),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.webview.nutrition.all,
      });
    },
  });
};

/** 오분류 피드백. 실패해도 사용자 흐름을 막지 않는다 */
export const useSaveMealFeedback = () => {
  return useMutation({
    mutationFn: (params: MealFeedbackRequest) => saveMealFeedback(params),
  });
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
