import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { Day6Step1 } from "./step1";
import { Day6Step2 } from "./step2";
import { Day6Step3 } from "./step3";

export const Route = createFileRoute("/_auth/_coaching/coaching/meal/day6/")({
  component: RouteComponent,
});

const stepDayCd = "06";

function RouteComponent() {
  const { pt } = usePageTranslation("coaching/meal/day6");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/meal",
    successMessage: pt("MSG_038"),
    errorMessage: pt("MSG_039"),
  });

  const [step1, setStep1] = useState("");
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

  return (
    <DayStepFlow
      title={pt("MSG_001")}
      showNextButton={(currentStep) => currentStep !== 1 || Boolean(step1Value)}
      showFooter
      onSave={saveAnswer}
    >
      <Day6Step1 step1={step1} onChange={setStep1} />
      <Day6Step2 step1={step1} />
      <Day6Step3 onSave={saveAnswer} />
    </DayStepFlow>
  );
}
