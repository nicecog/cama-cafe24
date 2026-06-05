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
import { Day7Step1 } from "./step1";
import { Day7Step2 } from "./step2";
import { Day7Step3 } from "./step3";

export const Route = createFileRoute(
  "/_auth/_coaching/coaching/physical/day7/",
)({
  component: RouteComponent,
});

const stepDayCd = "07";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/physical/day7");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/physical",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });
  const { mutateAsync: saveCoachingStep } = useSaveCoachingStep();

  const [step1, setStep1] = useState("");
  const [step3, setStep3] = useState<string[]>([]);
  const [stepCount, setStepCount] = useState("");
  const [isStepCountPopupOpen, setIsStepCountPopupOpen] = useState(false);

  const DAY7_TTS_TEXT: Record<number, string> = {
    1: pt("MSG_004"),
    2: pt("MSG_008"),
    3: pt("MSG_023"),
  };

  const options = [
    pt("MSG_018"),
    pt("MSG_019"),
    pt("MSG_020"),
    pt("MSG_021"),
    pt("MSG_022"),
  ];

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
    ...step3.map((item) => ({
      progressTypeCd: "A3",
      answerChoice: item,
      categoryCd: "C",
      stepDayCd,
      answerChoiceSeq: 0,
    })),
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
        title={pt("MSG_001")}
        ttsTexts={DAY7_TTS_TEXT}
        onBeforeNext={onBeforeNext}
        onSave={saveAnswer}
        showNextButton={(currentStep) => currentStep !== 1 || Boolean(step1)}
        showFooter
      >
        <Day7Step1 step1={step1} setStep1={setStep1} />
        <Day7Step2 />
        <Day7Step3 step3={step3} setStep3={setStep3} options={options} />
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
