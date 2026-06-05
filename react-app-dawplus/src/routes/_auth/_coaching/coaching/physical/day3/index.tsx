import { createFileRoute } from "@tanstack/react-router";
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
import { Day3Step1 } from "./step1";
import { Day3Step2 } from "./step2";
import { Day3Step3 } from "./step3";

export const Route = createFileRoute(
  "/_auth/_coaching/coaching/physical/day3/",
)({
  component: RouteComponent,
});

const stepDayCd = "03";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/physical/day3");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/physical",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });
  const { mutateAsync: saveCoachingStep } = useSaveCoachingStep();
  const [step1, setStep1] = useState<string[]>([]);
  const [stepCount, setStepCount] = useState("");
  const [isStepCountPopupOpen, setIsStepCountPopupOpen] = useState(false);

  const DAY3_TTS_TEXT: Record<number, string> = {
    1: pt("MSG_011"),
    2: pt("MSG_014"),
    3: pt("MSG_018"),
  };

  const options = [
    pt("MSG_002"),
    pt("MSG_003"),
    pt("MSG_004"),
    pt("MSG_005"),
    pt("MSG_006"),
    pt("MSG_007"),
    pt("MSG_008"),
  ];

  const onBeforeNext = (currentStep: number) => {
    if (currentStep === 1 && step1.length === 0) {
      toast({
        description: pt("MSG_009"),
      });
      return false;
    }

    return true;
  };

  const buildPayload = (): SaveCoachingAnswerInput[] => [
    ...step1.map((item) => ({
      progressTypeCd: "A1",
      answerChoice: item,
      categoryCd: "C",
      stepDayCd,
      answerChoiceSeq: 0,
    })),
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
    const today = new Date();
    const executionDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

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
        title={pt("MSG_010")}
        ttsTexts={DAY3_TTS_TEXT}
        onBeforeNext={onBeforeNext}
        onSave={saveAnswer}
      >
        <Day3Step1 step1={step1} setStep1={setStep1} options={options} />
        <Day3Step2 step1={step1} />
        <Day3Step3 />
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
