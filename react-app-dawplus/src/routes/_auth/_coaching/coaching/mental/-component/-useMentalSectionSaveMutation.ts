import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { saveCoachingAnswerList } from "@/apis/api/webview/coaching";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useDialog } from "@/hooks/useDialog";
import { queryKeys } from "@/lib/queryClient";
import { buildMentalCardAnswerList } from "./Cards";
import type { MentalCardAnswer, MentalCardUserType } from "./Cards";

interface SaveMentalSectionInput {
  answers: MentalCardAnswer[];
  session: 2 | 3 | 4 | 5;
  type: MentalCardUserType;
}

export const useMentalSectionSaveMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { alert } = useDialog();
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const accountName = accountMe.data?.name || accountMe.data?.nickName || "";

  return useMutation({
    mutationFn: async ({ answers, session, type }: SaveMentalSectionInput) => {
      if (!loginId || !accountName) {
        throw new Error("Account information is not available");
      }

      const dayCode = `Q${session}` as const;
      const payload = buildMentalCardAnswerList({
        accountName,
        answers,
        dayCode,
        loginId,
        stepDayCd: dayCode,
        type,
      });

      await saveCoachingAnswerList(payload);
    },
    onSuccess: async () => {
      await alert("저장되었습니다.");
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
    },
  });
};
