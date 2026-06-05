import { createFileRoute } from "@tanstack/react-router";
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
import { Day0Step1 } from "./step1";
import { Day0Step2 } from "./step2";
import { Day0Step3 } from "./step3";

export interface Day0Step1Data {
  value: string;
  extra: string;
}

export interface Day0Step3Data {
  value1: string;
  value2: string;
}

export const Route = createFileRoute(
  "/_auth/_coaching/coaching/physical/day0/",
)({
  component: RouteComponent,
});

const stepDayCd = "00";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/physical/day0");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/physical",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });
  const { mutateAsync: saveCoachingStep } = useSaveCoachingStep();
  const { pt: ptCommon } = usePageTranslation("coaching/coachingCommon");
  const accountName = useAccountName();

  const DAY0_TTS_TEXT: Record<number, string> = {
    1: `${pt("MSG_002")} ${pt("MSG_003")}`,
    2: pt("MSG_010"),
    3: `${pt("MSG_013")} ${pt("MSG_017")}`,
  };

  // Step 1 State
  const [step1, setStep1] = useState<Day0Step1Data>({
    value: "",
    extra: "",
  });

  // Step 3 State
  const [step3, setStep3] = useState<Day0Step3Data>({
    value1: "0",
    value2: "",
  });
  const [stepCount, setStepCount] = useState("");
  const [isStepCountPopupOpen, setIsStepCountPopupOpen] = useState(false);

  const handleBeforeNext = (currentStep: number) => {
    // Step 1 Validation
    if (currentStep === 1 && !step1.value.trim()) {
      toast({
        description: ptCommon("toast.select_required"),
      });
      return false;
    }

    if (
      currentStep === 1 &&
      step1.value === ptCommon("options.msg_007") &&
      !step1.extra.trim()
    ) {
      toast({
        description: pt("MSG_020"),
      });
      return false;
    }
    return true;
  };

  const buildPayload = (): SaveCoachingAnswerInput[] => {
    const value1 = step1.value.trim();
    const value2 = step3.value2.trim();

    return [
      {
        progressTypeCd: "A1",
        answerChoice:
          value1 === ptCommon("options.msg_007") && step1.extra.trim()
            ? `${value1}/${step1.extra.trim()}`
            : value1,
        refVal1:
          value1 === ptCommon("options.msg_007") ? step1.extra.trim() : "",
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
        answerChoice: `운동 습관 중요도 : ${step3.value1}`,
        refVal1: step3.value1,
        categoryCd: "C",
        stepDayCd,
        answerChoiceSeq: 0,
      },
      {
        progressTypeCd: "A3",
        answerChoice: `운동 습관을 위해 할수 있는것 : ${value2}`,
        refVal1: value2,
        categoryCd: "C",
        stepDayCd,
        answerChoiceSeq: 0,
      },
    ];
  };

  const saveAnswer = async () => {
    const value2 = step3.value2.trim();
    if (!value2) {
      toast({
        variant: "destructive",
        description: ptCommon("toast.action_required"),
      });
      return;
    }

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
        title={pt("title")}
        ttsTexts={DAY0_TTS_TEXT}
        showNextButton={(currentStep) =>
          currentStep !== 1 || Boolean(step1.value.trim())
        }
        onBeforeNext={handleBeforeNext}
        onSave={saveAnswer}
      >
        <Day0Step1
          accountName={accountName}
          step1={step1}
          onChange={setStep1}
        />
        <Day0Step2 />
        <Day0Step3
          accountName={accountName}
          step1={step1}
          step3={step3}
          onChange={setStep3}
        />
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
