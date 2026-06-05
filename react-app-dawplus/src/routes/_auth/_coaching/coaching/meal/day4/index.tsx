import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { useToast } from "@/hooks/use-toast";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { Day4Step1 } from "./step1";
import { Day4Step2 } from "./step2";
import { Day4Step3 } from "./step3";

export interface Day4Step1Data {
  value: string;
}

export interface Day4Step3Data {
  value: string[];
}

export const Route = createFileRoute("/_auth/_coaching/coaching/meal/day4/")({
  component: RouteComponent,
});

const stepDayCd = "04";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/meal/day4");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/meal",
    successMessage: pt("MSG_025"),
    errorMessage: pt("MSG_026"),
  });

  const [step1, setStep1] = useState("");
  const [step3, setStep3] = useState<string[]>([]);
  const step1Value = step1.trim();
  const isStep1Yes = step1Value === pt("MSG_007");

  const handleBeforeNext = (currentStep: number) => {
    if (currentStep === 1 && !step1Value) {
      toast({ description: pt("MSG_009") });
      return false;
    }

    return true;
  };

  const buildPayload = (): SaveCoachingAnswerInput[] => {
    return [
      {
        progressTypeCd: "A1",
        answerChoice: step1Value,
        categoryCd: "B",
        stepDayCd,
        answerChoiceSeq: 0,
      },
      {
        progressTypeCd: "A2",
        answerChoice: "",
        categoryCd: "B",
        stepDayCd,
        answerChoiceSeq: 0,
      },
      ...step3.map((value) => ({
        progressTypeCd: "A3",
        answerChoice: value,
        categoryCd: "B",
        stepDayCd,
        answerChoiceSeq: 0,
      })),
    ];
  };

  const saveAnswer = async () => {
    await saveAndNavigate(buildPayload());
  };

  return (
    <DayStepFlow
      title={pt("MSG_001")}
      totalSteps={isStep1Yes ? 3 : 2}
      showNextButton={(currentStep) => currentStep !== 1 || Boolean(step1Value)}
      showFooter
      onBeforeNext={handleBeforeNext}
      onSave={saveAnswer}
    >
      <Day4Step1 step1={step1} onChange={setStep1} />
      {isStep1Yes ? <Day4Step2 /> : null}
      <Day4Step3 step3={step3} onChange={setStep3} onSave={saveAnswer} />
    </DayStepFlow>
  );
}
