import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { useToast } from "@/hooks/use-toast";
import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import {
  createEmptyCoachingEntry,
  createTextCoachingEntry,
} from "../../-lib/coachingPayload";
import { Day1Step1 } from "./step1";
import { Day1Step2 } from "./step2";
import { Day1Step3 } from "./step3";

export interface Day1Step1Data {
  value: string;
}

export interface Day1Step3Data {
  value: string;
}

export const Route = createFileRoute("/_auth/_coaching/coaching/meal/day1/")({
  component: RouteComponent,
});

const stepDayCd = "01";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/meal/day1");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/meal",
    successMessage: pt("MSG_020"),
    errorMessage: pt("MSG_021"),
  });
  const accountName = useAccountName();

  const DAY1_TTS_TEXT: Record<number, string> = {
    1: pt("MSG_022"),
    2: pt("MSG_023"),
    3: pt("MSG_024"),
  };

  const [step1, setStep1] = useState<Day1Step1Data>({
    value: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [shouldShowStep2Alert, setShouldShowStep2Alert] = useState(false);

  const handleBeforeNext = (currentStep: number) => {
    if (currentStep === 1 && !step1.value.trim()) {
      toast({
        description: pt("MSG_007"),
      });
      return false;
    }

    return true;
  };

  const buildPayload = (): SaveCoachingAnswerInput[] => {
    const value1 = step1.value.trim();

    return [
      createTextCoachingEntry("A1", "B", stepDayCd, value1),
      createEmptyCoachingEntry("A2", "B", stepDayCd),
      createEmptyCoachingEntry("A3", "B", stepDayCd),
    ];
  };

  const saveAnswer = async () => {
    await saveAndNavigate(buildPayload());
  };

  const handleStepChange = (nextStep: number) => {
    setShouldShowStep2Alert(currentStep === 1 && nextStep === 2);
    setCurrentStep(nextStep);
  };

  return (
    <DayStepFlow
      title={pt("MSG_001")}
      ttsTexts={DAY1_TTS_TEXT}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      showNextButton={(currentStep) =>
        currentStep !== 1 || Boolean(step1.value.trim())
      }
      onBeforeNext={handleBeforeNext}
      onSave={saveAnswer}
    >
      <Day1Step1 step1={step1} onChange={setStep1} accountName={accountName} />
      <Day1Step2
        step1Value={step1.value}
        shouldShowAlert={shouldShowStep2Alert}
      />
      <Day1Step3 />
    </DayStepFlow>
  );
}
