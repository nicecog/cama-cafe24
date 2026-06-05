import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { useToast } from "@/hooks/use-toast";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { Day4Step1 } from "./step1";
import { Day4Step2 } from "./step2";
import { Day4Step3 } from "./step3";
import type { Day4Step1Data } from "./utils";

export const Route = createFileRoute("/_auth/_coaching/coaching/mind/day4/")({
  component: RouteComponent,
});

const stepDayCd = "04";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/sleep/day4");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/mind",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });

  const DAY4_TTS_TEXT: Record<number, string> = {
    1: pt("tts.msg_001"),
    2: pt("tts.msg_002"),
    3: pt("tts.msg_003"),
  };

  const [step1, setStep1] = useState<Day4Step1Data>({
    sleep: "1",
    rating: "0",
  });

  const buildPayload = (): SaveCoachingAnswerInput[] => {
    const _step1 = {
      progressTypeCd: "A1",
      answerChoice: `수면 시간 : ${step1.sleep}`,
      refVal1: step1.sleep,
      categoryCd: "D",
      stepDayCd,
      answerChoiceSeq: 0,
    };
    const _step1_2 = {
      progressTypeCd: "A1",
      answerChoice: `수면점수 : ${step1.rating}`,
      refVal1: step1.rating,
      categoryCd: "D",
      stepDayCd,
      answerChoiceSeq: 0,
    };
    const _step2 = {
      answerChoice: "",
      progressTypeCd: "A2",
      categoryCd: "D",
      stepDayCd,
      answerChoiceSeq: 0,
    };
    const _step3 = {
      answerChoice: "",
      progressTypeCd: "A3",
      categoryCd: "D",
      stepDayCd,
      answerChoiceSeq: 0,
    };

    return [_step1, _step1_2, _step2, _step3];
  };

  const onBeforeNext = (currentStep: number) => {
    if (currentStep === 1) {
      const isMissing = !step1.sleep.trim() || !step1.rating.trim();

      if (isMissing) {
        toast({
          description: pt("step1.msg_003"),
        });
        return false;
      }
    }

    return true;
  };

  const saveAnswer = async () => {
    await saveAndNavigate(buildPayload());
  };

  return (
    <DayStepFlow
      title={pt("msg_001")}
      ttsTexts={DAY4_TTS_TEXT}
      onBeforeNext={onBeforeNext}
      onSave={saveAnswer}
      showNextButton={(currentStep) =>
        currentStep !== 1 || Boolean(step1.sleep.trim() && step1.rating.trim())
      }
    >
      <Day4Step1 step1={step1} onChange={setStep1} />
      <Day4Step2 />
      <Day4Step3 />
    </DayStepFlow>
  );
}
