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
import { Day2Step1 } from "./step1";
import { Day2Step2 } from "./step2";
import { Day2Step3 } from "./step3";

interface Day2Item {
  label: string;
  value: boolean | null;
}

export const Route = createFileRoute(
  "/_auth/_coaching/coaching/physical/day2/",
)({
  component: RouteComponent,
});

const stepDayCd = "02";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/physical/day2");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/physical",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });
  const { mutateAsync: saveCoachingStep } = useSaveCoachingStep();
  const [step1, setStep1] = useState<Day2Item[]>([
    { label: pt("MSG_001"), value: null },
    { label: pt("MSG_002"), value: null },
    { label: pt("MSG_003"), value: null },
    { label: pt("MSG_004"), value: null },
    { label: pt("MSG_005"), value: null },
    { label: pt("MSG_006"), value: null },
    { label: pt("MSG_007"), value: null },
  ]);
  const [stepCount, setStepCount] = useState("");
  const [isStepCountPopupOpen, setIsStepCountPopupOpen] = useState(false);

  const selectedCount = step1.filter((item) => item.value).length;

  const DAY2_TTS_TEXT: Record<number, string> = {
    1: pt("MSG_012"),
    2: pt("MSG_013"),
    3: pt("MSG_014"),
  };

  const handleBeforeNext = (currentStep: number) => {
    if (currentStep === 1 && step1.some((item) => item.value === null)) {
      toast({
        description: pt("MSG_011"),
      });
      return false;
    }

    return true;
  };

  const buildPayload = (): SaveCoachingAnswerInput[] => {
    return [
      ...step1.map((item) => ({
        progressTypeCd: "A1",
        answerChoice: `${item.label} : ${item.value ? pt("MSG_008") : pt("MSG_009")}`,
        refVal1: item.value ? "Y" : "N",
        answerAddChoiceYn: "N",
        categoryCd: "C",
        stepDayCd,
        answerChoiceSeq: 0,
      })),
      {
        progressTypeCd: "A2",
        answerChoice: `${selectedCount}${pt("MSG_031")}`,
        refVal1: selectedCount,
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
  };

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
        ttsTexts={DAY2_TTS_TEXT}
        onBeforeNext={handleBeforeNext}
        onSave={saveAnswer}
        showNextButton={(currentStep) =>
          currentStep !== 1 || step1.every((item) => item.value !== null)
        }
      >
        <Day2Step1 step1={step1} setStep1={setStep1} />
        <Day2Step2 selectedCount={selectedCount} />
        <Day2Step3 />
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
