import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { useDialog } from "@/hooks/useDialog";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { Day9Step1, type Day9Step1Data } from "./step1";
import { Day9Step2 } from "./step2";
import { Day9Step3, type Day9Step3Data } from "./step3";

export const Route = createFileRoute("/_auth/_coaching/coaching/meal/day9/")({
  component: RouteComponent,
});

const stepDayCd = "09";

function RouteComponent() {
  const { alert } = useDialog();
  const { pt } = usePageTranslation("coaching/meal/day9");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/meal",
    successMessage: pt("MSG_038"),
    errorMessage: pt("MSG_039"),
  });

  const [step1, setStep1] = useState<Day9Step1Data>({
    value: "",
  });
  const [step3, setStep3] = useState<Day9Step3Data>({
    value: [],
  });

  const buildPayload = (): SaveCoachingAnswerInput[] => {
    const value1 = step1.value;

    return [
      {
        progressTypeCd: "A1",
        answerChoice: value1,
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
      ...step3.value.map((value) => ({
        progressTypeCd: "A3",
        answerChoice: value,
        categoryCd: "B",
        stepDayCd,
        answerChoiceSeq: 0,
      })),
    ];
  };

  const saveAnswer = async () => {
    if (step3.value.length === 0) {
      await alert(pt("MSG_023"));
      return;
    }

    await saveAndNavigate(buildPayload());
  };

  return (
    <DayStepFlow
      title={pt("MSG_001")}
      showNextButton={(currentStep) =>
        currentStep !== 1 || Boolean(step1.value.trim())
      }
      showFooter
      onSave={saveAnswer}
    >
      <Day9Step1 data={step1} onChange={setStep1} />
      <Day9Step2 step1={step1.value} />
      <Day9Step3 step3={step3} onChange={setStep3} onSave={saveAnswer} />
    </DayStepFlow>
  );
}
