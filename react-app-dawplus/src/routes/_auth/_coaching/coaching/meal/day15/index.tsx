import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { Day15Step1 } from "./step1";
import { Day15Step2 } from "./step2";
import { Day15Step3 } from "./step3";

export const Route = createFileRoute("/_auth/_coaching/coaching/meal/day15/")({
  component: RouteComponent,
});

const stepDayCd = "15";

function RouteComponent() {
  const { pt } = usePageTranslation("coaching/meal/day15");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/meal",
    successMessage: pt("MSG_031"),
    errorMessage: pt("MSG_032"),
  });
  const [step1, setStep1] = useState("");

  const buildPayload = (): SaveCoachingAnswerInput[] => [
    {
      progressTypeCd: "A1",
      answerChoice: step1.trim(),
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
      showNextButton={(currentStep) =>
        currentStep !== 1 || Boolean(step1.trim())
      }
      showFooter
      onSave={saveAnswer}
    >
      <Day15Step1 data={step1} onChange={setStep1} />
      <Day15Step2 data={step1} />
      <Day15Step3 onSave={saveAnswer} />
    </DayStepFlow>
  );
}
