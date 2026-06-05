import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { useToast } from "@/hooks/use-toast";
import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { Day1Step1 } from "./step1";
import { Day1Step2 } from "./step2";
import { Day1Step3 } from "./step3";

export interface Day1Step1Data {
  value: string;
}

export interface Day1Step3Data {
  value: string;
}

export const Route = createFileRoute("/_auth/_coaching/coaching/mind/day1/")({
  component: RouteComponent,
});

const stepDayCd = "01";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/sleep/day1");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/mind",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });
  const accountName = useAccountName();

  const DAY1_TTS_TEXT: Record<number, string> = {
    1: pt("tts.step1"),
    2: pt("tts.step2"),
    3: pt("tts.step3"),
  };

  const [step1, setStep1] = useState<Day1Step1Data>({
    value: "",
  });

  const [step3, setStep3] = useState<Day1Step3Data>({
    value: "",
  });

  const handleBeforeNext = (currentStep: number) => {
    if (currentStep === 1 && !step1.value.trim()) {
      toast({
        description: pt("step1.toast.select_required"),
      });
      return false;
    }

    return true;
  };

  const buildPayload = (): SaveCoachingAnswerInput[] => {
    const value1 = step1.value.trim();
    const value3 = step3.value.trim();

    return [
      {
        progressTypeCd: "A1",
        answerChoice: value1,
        refVal1: value1,
        categoryCd: "D",
        stepDayCd,
        answerChoiceSeq: 0,
      },
      {
        progressTypeCd: "A2",
        answerChoice: "",
        categoryCd: "D",
        stepDayCd,
        answerChoiceSeq: 0,
      },
      {
        progressTypeCd: "A3",
        answerChoice: `잠을 잘자면 좋은점 : ${value3}`,
        refVal1: value3,
        categoryCd: "D",
        stepDayCd,
        answerChoiceSeq: 0,
      },
    ];
  };

  const saveAnswer = async () => {
    const value3 = step3.value.trim();
    if (!value3) {
      toast({
        variant: "destructive",
        description: pt("step3.toast.action_required"),
      });
      return;
    }

    await saveAndNavigate(buildPayload());
  };

  return (
    <DayStepFlow
      title={pt("title", { name: accountName })}
      ttsTexts={DAY1_TTS_TEXT}
      showNextButton={(currentStep) =>
        currentStep !== 1 || Boolean(step1.value.trim())
      }
      onBeforeNext={handleBeforeNext}
      onSave={saveAnswer}
    >
      <Day1Step1 step1={step1} onChange={setStep1} accountName={accountName} />
      <Day1Step2 step1Value={step1.value} />
      <Day1Step3 accountName={accountName} step3={step3} onChange={setStep3} />
    </DayStepFlow>
  );
}
