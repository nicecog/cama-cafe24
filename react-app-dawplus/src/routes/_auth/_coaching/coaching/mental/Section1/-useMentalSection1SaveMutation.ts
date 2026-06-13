import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import {
  saveCoachingAnswerList,
  saveCoachingSchedule,
} from "@/apis/api/webview/coaching";
import type { SaveCoachingAnswerParams } from "@/apis/types";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useDialog } from "@/hooks/useDialog";
import { queryKeys } from "@/lib/queryClient";
import { buildMentalSection1SavePayload } from "./-save";
import type {
  MentalSchedulePayload,
  MentalTrainingPlan,
  MentalTypeResult,
} from "./-types";

interface SaveMentalSection1Input {
  answers: number[];
  result: MentalTypeResult;
  trainingPlans: [MentalTrainingPlan, MentalTrainingPlan];
}

interface SaveMentalSection1Result {
  answerListPayload: SaveCoachingAnswerParams[];
  schedulePayload: MentalSchedulePayload[];
}

export const useMentalSection1SaveMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { alert } = useDialog();
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const accountName = accountMe.data?.name || accountMe.data?.nickName || "";

  return useMutation({
    mutationFn: async (
      params: SaveMentalSection1Input,
    ): Promise<SaveMentalSection1Result> => {
      if (!loginId || !accountName) {
        throw new Error("Account information is not available");
      }

      const payload = buildMentalSection1SavePayload({
        ...params,
        loginId,
        accountName,
      });

      await saveCoachingSchedule(payload.schedulePayload);
      await saveCoachingAnswerList(payload.answerListPayload);
      await alert("마음근육 훈련 일정이 저장되었어요. 이제 정해진 일정에 맞춰 훈련이 시작됩니다.");
      await navigate({
        to: "/coaching",
        replace: true,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.webview.coaching.answerList(loginId, "D"),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.webview.coaching.progressList(loginId),
      });

      return payload;
    },
  });
};
