import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useUserAnswerInfoList } from "@/hooks/queries";
import { useToast } from "@/hooks/use-toast";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { Day8Step1 } from "./step1";
import { Day8Step2 } from "./step2";
import { Day8Step3 } from "./step3";
import { type Day8Step1Data, getDay8PreviousDaySummary } from "./utils";

export const Route = createFileRoute("/_auth/_coaching/coaching/sleep/day8/")({
  component: RouteComponent,
});

const stepDayCd = "08";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/sleep/day8");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/sleep",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const accountName =
    accountMe.data?.name || accountMe.data?.nickName || "회원";

  const { data: answerList = [] } = useUserAnswerInfoList({
    loginId,
    categoryCd: "A",
  });

  const [step1, setStep1] = useState<Day8Step1Data>({
    sleep: "1",
    rating: "0",
    answer: "",
  });
  const [step3, setStep3] = useState("");

  const previousDaySummary = useMemo(
    () => getDay8PreviousDaySummary(answerList),
    [answerList],
  );

  const isYes = step1.answer === "예";

  const buildPayload = () => {
    const _step1 = {
      progressTypeCd: "A1",
      answerChoice: `수면 시간 : ${step1.sleep}`,
      refVal1: step1.sleep,
      categoryCd: "A",
      stepDayCd,
      answerChoiceSeq: 0,
    };
    const _step1_2 = {
      progressTypeCd: "A1",
      answerChoice: `수면점수 : ${step1.rating}`,
      refVal1: step1.rating,
      categoryCd: "A",
      stepDayCd,
      answerChoiceSeq: 0,
    };
    const _step1_3 = {
      progressTypeCd: "A1",
      answerChoice: step1.answer,
      categoryCd: "A",
      stepDayCd,
      answerChoiceSeq: 0,
    };
    const _step2 = {
      answerChoice: "",
      progressTypeCd: "A2",
      categoryCd: "A",
      stepDayCd,
      answerChoiceSeq: 0,
    };
    const _step3 = {
      answerChoice: step3,
      progressTypeCd: "A3",
      categoryCd: "A",
      stepDayCd,
      answerChoiceSeq: 0,
    };

    return [_step1, _step1_2, _step1_3, _step2, _step3];
  };

  const onBeforeNext = (currentStep: number) => {
    if (currentStep === 1) {
      const isMissing =
        !step1.sleep.trim() || !step1.rating.trim() || !step1.answer.trim();

      if (isMissing) {
        toast({
          description: pt("step1.msg_009"),
        });
        return false;
      }
    }

    if (currentStep === 3 && !step3.trim()) {
      toast({
        description: pt("step3.msg_004"),
      });
      return false;
    }

    return true;
  };

  const saveAnswer = async () => {
    if (!step3.trim()) {
      toast({
        description: pt("step3.msg_004"),
      });
      return;
    }

    await saveAndNavigate(buildPayload());
  };

  return (
    <DayStepFlow
      title={pt("msg_001")}
      ttsTexts={{
        1: pt("tts.msg_001"),
        2: pt("tts.msg_002"),
        3: pt("tts.msg_003"),
      }}
      onBeforeNext={onBeforeNext}
      onSave={saveAnswer}
      showNextButton={(currentStep) =>
        currentStep !== 1 ||
        Boolean(step1.sleep.trim() && step1.rating.trim() && step1.answer)
      }
    >
      <Day8Step1
        step1={step1}
        accountName={accountName}
        previousDaySummary={previousDaySummary}
        onChange={setStep1}
      />
      <Day8Step2 isYes={isYes} />
      <Day8Step3 value={step3} onChange={setStep3} />
    </DayStepFlow>
  );
}
