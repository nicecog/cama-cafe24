import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { saveCoachingAnswerList } from "@/apis/api/webview/coaching";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useCoachingProgressList } from "@/hooks/queries";
import useMentalType from "@/hooks/useMentalType";
import { useDialog } from "@/hooks/useDialog";
import { queryKeys } from "@/lib/queryClient";
import { getMentalTypeCode } from "./-mentalCompat";

export const useMentalSection6CompleteMutation = ({
  onCompleted,
}: {
  onCompleted?: () => Promise<void> | void;
} = {}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { alert } = useDialog();
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const accountName = accountMe.data?.name || accountMe.data?.nickName || "";
  const type = useMentalType();
  const { data: progressList = [] } = useCoachingProgressList(loginId);

  return useMutation({
    mutationFn: async () => {
      const currentProgress =
        progressList.find((item) => item.categoryCd === "D")?.progress ?? 0;

      if (currentProgress === 100) {
        await alert("수고 하셨습니다!");
        return;
      }

      const prefix = getMentalTypeCode(type);

      const payload = ["Q6", "Q7"].map((stepDayCd) => ({
        accountName,
        loginId,
        answerChoice: "",
        answerChoiceSeq: 0,
        categoryCd: "D",
        progressTypeCd: `${prefix}01`,
        stepDayCd,
      }));

      await saveCoachingAnswerList(payload);
    },
    onSuccess: async () => {
      if (
        progressList.find((item) => item.categoryCd === "D")?.progress === 100
      ) {
        await navigate({ to: "/coaching", replace: true });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.webview.coaching.answerList(loginId, "D"),
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.webview.coaching.progressList(loginId),
        });
        return;
      }

      await alert("저장되었습니다.");

      if (onCompleted) {
        await onCompleted();
        await queryClient.invalidateQueries({
          queryKey: queryKeys.webview.coaching.answerList(loginId, "D"),
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.webview.coaching.progressList(loginId),
        });
        return;
      }

      await navigate({ to: "/coaching", replace: true });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.webview.coaching.answerList(loginId, "D"),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.webview.coaching.progressList(loginId),
      });
    },
  });
};
