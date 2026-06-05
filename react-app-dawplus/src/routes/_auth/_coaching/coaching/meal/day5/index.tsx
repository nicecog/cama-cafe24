import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";

import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { Day5Step1 } from "./step1";
import { Day5Step2 } from "./step2";
import { Day5Step3 } from "./step3";

export const Route = createFileRoute("/_auth/_coaching/coaching/meal/day5/")({
  component: RouteComponent,
});

const stepDayCd = "05";

function RouteComponent() {
  const { pt } = usePageTranslation("coaching/meal/day5");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/meal",
    successMessage: pt("MSG_032"),
    errorMessage: pt("MSG_033"),
  });

  const [step1, setStep1] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [shouldShowStep2Alert, setShouldShowStep2Alert] = useState(false);
  const step1Value = step1.trim();

  const buildPayload = (): SaveCoachingAnswerInput[] => [
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
    {
      progressTypeCd: "A3",
      answerChoice: "",
      categoryCd: "B",
      stepDayCd,
      answerChoiceSeq: 0,
    },
  ];

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
      currentStep={currentStep}
      onStepChange={handleStepChange}
      showNextButton={(currentStep) => currentStep !== 1 || Boolean(step1Value)}
      onSave={saveAnswer}
    >
      <Day5Step1 step1={step1} onChange={setStep1} />
      <Day5Step2
        step1Value={step1Value}
        shouldShowAlert={shouldShowStep2Alert}
      />
      <Day5Step3 />
    </DayStepFlow>
  );
}
