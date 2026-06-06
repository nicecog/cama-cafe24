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
import { Day6Step1 } from "./step1";
import { Day6Step2 } from "./step2";
import { Day6Step3 } from "./step3";

export const Route = createFileRoute(
  "/_auth/_coaching/coaching/physical/day6/",
)({
  component: RouteComponent,
});

const stepDayCd = "06";
function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/physical/day6");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/physical",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });
  const { mutateAsync: saveCoachingStep } = useSaveCoachingStep();

  const [step1, setStep1] = useState({
    type: "",
    time: "10",
  });
  const [stepCount, setStepCount] = useState("");
  const [isStepCountPopupOpen, setIsStepCountPopupOpen] = useState(false);

  const DAY6_TTS_TEXT: Record<number, string> = {
    1: pt("MSG_003"),
    2: pt("MSG_005"),
    3: pt("MSG_011"),
  };

  const onBeforeNext = (currentStep: number) => {
    if (currentStep === 1 && !step1.type.trim()) {
      toast({
        description: pt("MSG_002"),
      });
      return false;
    }

    return true;
  };

  const buildPayload = (): SaveCoachingAnswerInput[] => [
    {
      progressTypeCd: "A1",
      answerChoice: step1.type,
      categoryCd: "C",
      stepDayCd,
      answerChoiceSeq: 0,
    },
    {
      progressTypeCd: "A1",
      answerChoice: `${step1.time} ${pt("MSG_018")}`,
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
      answerChoice: "",
      categoryCd: "C",
      stepDayCd,
      answerChoiceSeq: 0,
    },
  ];

  const saveAnswer = async () => {
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
        ttsTexts={DAY6_TTS_TEXT}
        onBeforeNext={onBeforeNext}
        onSave={saveAnswer}
        showNextButton={(currentStep) =>
          currentStep !== 1 || Boolean(step1.type)
        }
        showFooter
      >
        <Day6Step1 step1={step1} setStep1={setStep1} />
        <Day6Step2 step1={step1} />
        <Day6Step3 />
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
