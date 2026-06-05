import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchCoachingCodeList,
  fetchCoachingProgressList,
  fetchExerciseUserClassInfo,
  fetchUserAnswerInfoList,
} from "@/apis/api/webview/coaching";
import type {
  CoachingCodeListParams,
  WebviewUserAnswerInfo,
  WebviewUserAnswerInfoListParams,
} from "@/apis/types";
import { queryKeys } from "@/lib/queryClient";

/**
 * 건강코칭 카테고리별 진도율 조회
 * @param loginId - 로그인 ID
 */
export const useCoachingProgressList = (loginId: string = "") => {
  return useQuery({
    queryKey: queryKeys.webview.coaching.progressList(loginId),
    queryFn: () => fetchCoachingProgressList(loginId),
    enabled: !!loginId,
    select: (data) => data.response ?? [],
  });
};

/**
 * 코칭 답변 정보 리스트 조회
 * @param params - { loginId, categoryCd }
 */
export const useUserAnswerInfoList = (
  params: WebviewUserAnswerInfoListParams,
) => {
  return useQuery({
    queryKey: queryKeys.webview.coaching.answerList(
      params.loginId,
      params.categoryCd,
    ),
    queryFn: () => fetchUserAnswerInfoList(params),
    enabled: !!params.loginId && !!params.categoryCd,
    select: (data) => data.response ?? [],
  });
};

/**
 * 운동 사용자 클래스 정보 조회
 * @param loginId - 로그인 ID
 */
export const useExerciseUserClassInfo = (loginId: string = "") => {
  return useQuery({
    queryKey: queryKeys.webview.coaching.exerciseClassInfo(loginId),
    queryFn: () => fetchExerciseUserClassInfo(loginId),
    enabled: !!loginId,
    select: (data) => data.response,
  });
};

/**
 * 코칭 서비스 코드 리스트 조회
 * @param params - 코드 조회 파라미터 {code, cd}
 * @param enabled - 쿼리 활성화 여부
 */
export const useCoachingCodeList = (params: CoachingCodeListParams) => {
  return useQuery({
    queryKey: queryKeys.webview.coaching.codeList(params.code, params.cd),
    queryFn: () => fetchCoachingCodeList(params),
    // enabled: !!params.code,
  });
};

const getCurrentStepDay = (
  answerList: WebviewUserAnswerInfo[],
  categoryCd: string,
  maxDay?: number,
) => {
  const categoryAnswerList = answerList.filter(
    (item) => item.categoryCd === categoryCd,
  );

  if (categoryAnswerList.length === 0) {
    return 0;
  }

  const parsedDays = categoryAnswerList
    .map((item) => parseInt(item.stepDayCd, 10))
    .filter((day) => !Number.isNaN(day));

  if (parsedDays.length === 0) {
    return 0;
  }

  const nextDay = Math.max(...parsedDays) + 1;

  if (typeof maxDay === "number") {
    return Math.min(nextDay, maxDay);
  }

  return nextDay;
};

/**
 * 코칭 초기 데이터 조회
 * - 진도율
 * - 답변 목록
 * - 현재 진행 일차 계산
 */
export const useCoachingInitialData = (
  loginId: string = "",
  categoryCd: string,
  maxDay?: number,
) => {
  const progressQuery = useCoachingProgressList(loginId);
  const answerQuery = useUserAnswerInfoList({
    loginId,
    categoryCd,
  });

  const currentDay = useMemo(() => {
    return getCurrentStepDay(answerQuery.data ?? [], categoryCd, maxDay);
  }, [answerQuery.data, categoryCd, maxDay]);

  return {
    progressQuery,
    progressList: progressQuery.data ?? [],
    answerQuery,
    answerList: answerQuery.data ?? [],
    currentDay,
  };
};

/**
 * 코칭 현재 일차만 조회
 * - 현재 Day 계산에만 필요한 화면용
 */
export const useCoachingCurrentDay = (
  loginId: string = "",
  categoryCd: string,
  maxDay?: number,
) => {
  const answerQuery = useUserAnswerInfoList({
    loginId,
    categoryCd,
  });

  const currentDay = useMemo(() => {
    return getCurrentStepDay(answerQuery.data ?? [], categoryCd, maxDay);
  }, [answerQuery.data, categoryCd, maxDay]);

  return {
    answerQuery,
    answerList: answerQuery.data ?? [],
    currentDay,
  };
};
