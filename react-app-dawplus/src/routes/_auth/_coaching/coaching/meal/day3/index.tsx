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
  createTextCoachingEntries,
} from "../../-lib/coachingPayload";
import { Day3Step1 } from "./step1";
import { Day3Step2 } from "./step2";
import { Day3Step3 } from "./step3";

export interface Day3Step1Data {
  value: string[];
}

export interface Day3Step3Data {
  value: string[];
}

export const Route = createFileRoute("/_auth/_coaching/coaching/meal/day3/")({
  component: RouteComponent,
});

const stepDayCd = "03";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/meal/day3");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/meal",
    successMessage: pt("MSG_028"),
    errorMessage: pt("MSG_029"),
  });
  const accountName = useAccountName();

  const [step1, setStep1] = useState<Day3Step1Data>({
    value: [],
  });

  const [step3, setStep3] = useState<Day3Step3Data>({
    value: [],
  });

  const step1Selected = step1.value.length > 0;

  const handleBeforeNext = (currentStep: number) => {
    if (currentStep === 1 && !step1Selected) {
      toast({
        description: pt("MSG_015"),
      });
      return false;
    }

    return true;
  };

  const buildPayload = (): SaveCoachingAnswerInput[] => {
    const value1 = step1.value;
    const value3 = step3.value;

    return [
      ...createTextCoachingEntries("A1", "B", stepDayCd, value1),
      createEmptyCoachingEntry("A2", "B", stepDayCd),
      ...createTextCoachingEntries("A3", "B", stepDayCd, value3),
    ];
  };

  const saveAnswer = async () => {
    if (step3.value.length === 0) {
      toast({
        variant: "destructive",
        description: pt("MSG_027", { name: accountName }),
      });
      return;
    }

    await saveAndNavigate(buildPayload());
  };

  return (
    <DayStepFlow
      title={pt("MSG_001")}
      ttsTexts={{
        1: pt("MSG_002"),
        2: pt("MSG_003"),
        3: pt("MSG_004"),
      }}
      showNextButton={(currentStep) => currentStep !== 1 || step1Selected}
      onBeforeNext={handleBeforeNext}
      onSave={saveAnswer}
    >
      <Day3Step1 step1={step1} onChange={setStep1} />
      <Day3Step2 step1={step1.value} />
      <Day3Step3 step1={step1.value} step3={step3} onChange={setStep3} />
    </DayStepFlow>
  );
}
