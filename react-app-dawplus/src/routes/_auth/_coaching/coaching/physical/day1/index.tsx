import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { useState } from "react";
import {
  type SaveCoachingAnswerInput,
  useSaveCoachingStep,
} from "@/hooks/mutations";
import { useToast } from "@/hooks/use-toast";
import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { StepCountPopup } from "../../-components/StepCountPopup";
import { Day1Step1 } from "./step1";
import { Day1Step2 } from "./step2";
import { Day1Step3 } from "./step3";

export interface Day1Step1Data {
  value: string;
}

export interface Day1Step3Data {
  value: string;
}

export const Route = createFileRoute(
  "/_auth/_coaching/coaching/physical/day1/",
)({
  component: RouteComponent,
});

const stepDayCd = "01";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/physical/day1");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/physical",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });
  const { mutateAsync: saveCoachingStep } = useSaveCoachingStep();
  const accountName = useAccountName();

  const DAY1_TTS_TEXT: Record<number, string> = {
    1: pt("tts.step1"),
    2: pt("tts.step2"),
    3: pt("tts.step3"),
  };

  const [step1, setStep1] = useState<Day1Step1Data>({
    value: "",
  });
  const [stepCount, setStepCount] = useState("");
  const [isStepCountPopupOpen, setIsStepCountPopupOpen] = useState(false);

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

    return [
      {
        progressTypeCd: "A1",
        answerChoice: value1,
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
        answerChoice: " - ",
        categoryCd: "C",
        stepDayCd,
        answerChoiceSeq: 0,
      },
    ];
  };

  const openStepCountPopup = async () => {
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
        title={pt("title")}
        ttsTexts={DAY1_TTS_TEXT}
        showNextButton={(currentStep) =>
          currentStep !== 1 || Boolean(step1.value.trim())
        }
        onBeforeNext={handleBeforeNext}
        onSave={openStepCountPopup}
      >
        <Day1Step1
          step1={step1}
          onChange={setStep1}
          accountName={accountName}
        />
        <Day1Step2 step1Value={step1.value} />
        <Day1Step3 accountName={accountName} />
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
