import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { useToast } from "@/hooks/use-toast";
import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { Day2Step1 } from "./step1";
import { Day2Step2 } from "./step2";
import { Day2Step3 } from "./step3";

export interface Day2Step1Data {
  value: string;
}

export interface Day2Step3Data {
  value: string;
}

export const Route = createFileRoute("/_auth/_coaching/coaching/sleep/day2/")({
  component: RouteComponent,
});

const stepDayCd = "02";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/sleep/day2");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/sleep",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });
  const accountName = useAccountName();

  const DAY2_TTS_TEXT: Record<number, string> = {
    1: pt("tts.msg_001"),
    2: pt("tts.msg_002"),
    3: pt("tts.msg_003"),
  };

  const [step1, setStep1] = useState<Day2Step1Data>({
    value: "",
  });

  const [step3, setStep3] = useState<Day2Step3Data>({
    value: "",
  });

  const handleBeforeNext = (currentStep: number) => {
    if (currentStep === 1 && !step1.value.trim()) {
      toast({
        description: pt("step1.msg_008"),
      });
      return false;
    }

    return true;
  };

  const buildPayload = (hours: string): SaveCoachingAnswerInput[] => {
    const value1 = step1.value.trim();

    return [
      {
        progressTypeCd: "A1",
        answerChoice: value1,
        refVal1: value1,
        categoryCd: "A",
        stepDayCd,
        answerChoiceSeq: 0,
      },
      {
        progressTypeCd: "A2",
        answerChoice: "",
        categoryCd: "A",
        stepDayCd,
        answerChoiceSeq: 0,
      },
      {
        progressTypeCd: "A3",
        answerChoice: `수면 시간 목표 : ${hours}시간`,
        refVal1: hours,
        categoryCd: "A",
        stepDayCd,
        answerChoiceSeq: 0,
      },
    ];
  };

  const saveAnswer = async () => {
    const value3 = step3.value.trim();
    const isNumeric = /^\d+$/.test(value3);
    const hours = Number(value3);

    if (!value3 || !isNumeric || hours < 1 || hours > 24) {
      toast({
        variant: "destructive",
        description: pt("step3.msg_008"),
      });
      return;
    }

    await saveAndNavigate(buildPayload(String(hours)));
  };

  return (
    <DayStepFlow
      title={pt("msg_001")}
      ttsTexts={DAY2_TTS_TEXT}
      showNextButton={(currentStep) =>
        currentStep !== 1 || Boolean(step1.value.trim())
      }
      onBeforeNext={handleBeforeNext}
      onSave={saveAnswer}
    >
      <Day2Step1 step1={step1} onChange={setStep1} />
      <Day2Step2 step1Value={step1.value} />
      <Day2Step3 accountName={accountName} step3={step3} onChange={setStep3} />
    </DayStepFlow>
  );
}
