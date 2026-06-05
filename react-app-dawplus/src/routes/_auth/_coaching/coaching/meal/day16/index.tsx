import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { Day16Step1 } from "./step1";
import { Day16Step2 } from "./step2";
import { Day16Step3 } from "./step3";

export const Route = createFileRoute("/_auth/_coaching/coaching/meal/day16/")({
  component: RouteComponent,
});

const stepDayCd = "16";

function RouteComponent() {
  const { pt } = usePageTranslation("coaching/meal/day16");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/meal",
    successMessage: pt("MSG_018"),
    errorMessage: pt("MSG_019"),
  });
  const [step1, setStep1] = useState<number | null>(null);
  const answerList = [
    pt("MSG_005"),
    pt("MSG_006"),
    pt("MSG_007"),
    pt("MSG_008"),
  ];

  const buildPayload = (): SaveCoachingAnswerInput[] => [
    {
      progressTypeCd: "A1",
      answerChoice: step1 === null ? "" : answerList[step1],
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
      showNextButton={(currentStep) => currentStep !== 1 || step1 !== null}
      showFooter
      onSave={saveAnswer}
    >
      <Day16Step1 answerList={answerList} data={step1} onChange={setStep1} />
      <Day16Step2 />
      <Day16Step3 onSave={saveAnswer} />
    </DayStepFlow>
  );
}
