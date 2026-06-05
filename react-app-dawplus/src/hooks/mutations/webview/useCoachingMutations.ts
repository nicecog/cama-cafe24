import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import {
  saveCoachingAnswerList,
  saveCoachingStep,
} from "@/apis/api/webview/coaching";
import type {
  SaveCoachingAnswerParams,
  SaveCoachingStepParams,
} from "@/apis/types";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { queryKeys } from "@/lib/queryClient";

export type SaveCoachingAnswerInput = Omit<
  SaveCoachingAnswerParams,
  "loginId" | "accountName"
>;

export type SaveCoachingStepInput = Omit<SaveCoachingStepParams, "loginId">;

/**
 * 코칭 답변 저장 Mutation
 * PUT /api/coaching/service/answerList
 */
export const useSaveCoachingAnswerList = () => {
  const queryClient = useQueryClient();
  const { data: accountMe } = useAtomValue(accountMeAtom);
  const loginId = accountMe?.loginId ?? "";
  const accountName = accountMe?.name || accountMe?.nickName || "";

  return useMutation({
    mutationFn: async (params: SaveCoachingAnswerInput[]) => {
      if (!loginId) {
        throw new Error("Account information is not available");
      }

      const enrichedParams: SaveCoachingAnswerParams[] = params.map((item) => ({
        ...item,
        loginId,
        accountName,
      }));

      return saveCoachingAnswerList(enrichedParams);
    },
    onSuccess: (_, variables) => {
      // 답변 저장 후 관련 캐시 무효화
      if (variables.length > 0) {
        const { categoryCd } = variables[0];
        // 진도율 리스트 무효화
        queryClient.invalidateQueries({
          queryKey: queryKeys.webview.coaching.progressList(loginId),
        });
        // 코칭 답변 리스트 무효화
        queryClient.invalidateQueries({
          queryKey: queryKeys.webview.coaching.answerList(loginId, categoryCd),
        });
      }
    },
  });
};

/**
 * 걸음수 저장 Mutation
 * PUT /api/coaching/service/step
 */
export const useSaveCoachingStep = () => {
  const { data: accountMe } = useAtomValue(accountMeAtom);
  const loginId = accountMe?.loginId ?? "";

  return useMutation({
    mutationFn: async (params: SaveCoachingStepInput) => {
      if (!loginId) {
        throw new Error("Account information is not available");
      }

      return saveCoachingStep({
        ...params,
        loginId,
      });
    },
  });
};

/**
 * 다단계 폼 답변 데이터를 API 스펙에 맞게 변환하는 유틸리티 함수
 */
export const formatCoachingAnswer = (params: {
  progressTypeCd: string;
  categoryCd: string;
  stepDayCd: string;
  loginId: string;
  accountName: string;
  value: string;
  additionalValue?: string;
  isNumeric?: boolean;
  numericLabel?: string;
}): SaveCoachingAnswerParams => {
  const {
    progressTypeCd,
    categoryCd,
    stepDayCd,
    loginId,
    accountName,
    value,
    additionalValue,
    isNumeric,
    numericLabel,
  } = params;

  let answerChoice = value;
  let refVal1 = value;

  // 1. 가치 선택 단계 (예: A1 단계) - '기타' 처리
  if (value === "기타" && additionalValue) {
    answerChoice = `기타/${additionalValue}`;
    refVal1 = additionalValue;
  }
  // 2. 수치 및 서술형 단계 (예: A3 단계) - 점수/텍스트 처리
  else if (isNumeric || numericLabel) {
    answerChoice = `${numericLabel || "값"} : ${value}`;
    refVal1 = value;
  }

  return {
    progressTypeCd,
    answerChoice,
    refVal1,
    categoryCd,
    stepDayCd,
    loginId,
    accountName,
    answerChoiceSeq: 0,
  };
};
