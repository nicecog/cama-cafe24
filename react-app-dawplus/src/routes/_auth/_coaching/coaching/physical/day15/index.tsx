import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { useState } from "react";
import {
  type SaveCoachingAnswerInput,
  useSaveCoachingStep,
} from "@/hooks/mutations";
import { useToast } from "@/hooks/use-toast";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { StepCountPopup } from "../../-components/StepCountPopup";
import { Day15Step1 } from "./step1";
import { Day15Step2 } from "./step2";
import { Day15Step3 } from "./step3";

export const Route = createFileRoute(
  "/_auth/_coaching/coaching/physical/day15/",
)({
  component: RouteComponent,
});

const stepDayCd = "15";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/physical/day15");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/physical",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });
  const { mutateAsync: saveCoachingStep } = useSaveCoachingStep();

  const [step1, setStep1] = useState("");
  const [step3, setStep3] = useState("");
  const [stepCount, setStepCount] = useState("");
  const [isStepCountPopupOpen, setIsStepCountPopupOpen] = useState(false);

  const DAY15_TTS_TEXT: Record<number, string> = {
    1: pt("MSG_005"),
    2: pt("MSG_009"),
    3: pt("MSG_018"),
  };

  const onBeforeNext = (currentStep: number) => {
    if (currentStep === 1 && !step1.trim()) {
      toast({
        description: pt("MSG_003"),
      });
      return false;
    }

    return true;
  };

  const buildPayload = (): SaveCoachingAnswerInput[] => [
    {
      progressTypeCd: "A1",
      answerChoice: step1,
      categoryCd: "C",
      stepDayCd,
      answerChoiceSeq: 0,
    },
    {
      progressTypeCd: "A2",
      answerChoice: "",
      categoryCd: "C",
      stepDayCd,
      answerChoiceSeq: 0,
    },
    {
      progressTypeCd: "A3",
      answerChoice: step3,
      categoryCd: "C",
      stepDayCd,
      answerChoiceSeq: 0,
    },
  ];

  const saveAnswer = async () => {
    if (!step3.trim()) {
      toast({
        variant: "destructive",
        description: pt("MSG_003"),
      });
      return;
    }

    setIsStepCountPopupOpen(true);
  };

  const handleStepCountConfirm = async (trimmedStepCount: string) => {
    const executionDate = format(new Date(), "yyyy-MM-dd");

    try {
      await saveCoachingStep({
        executionDate,
        stepNum: Number(trimmedStepCount),
      });
      setIsStepCountPopupOpen(false);
      await saveAndNavigate(buildPayload());
    } catch {
      toast({
        variant: "destructive",
        description: "저장 중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <>
      <DayStepFlow
        title={pt("MSG_001")}
        ttsTexts={DAY15_TTS_TEXT}
        onBeforeNext={onBeforeNext}
        onSave={saveAnswer}
        showNextButton={(currentStep) => currentStep !== 1 || Boolean(step1)}
        showFooter
      >
        <Day15Step1 step1={step1} setStep1={setStep1} />
        <Day15Step2 />
        <Day15Step3 step3={step3} setStep3={setStep3} />
      </DayStepFlow>
      <StepCountPopup
        open={isStepCountPopupOpen}
        setOpen={setIsStepCountPopupOpen}
        value={stepCount}
        onChange={setStepCount}
        onConfirm={handleStepCountConfirm}
      />
    </>
  );
}
