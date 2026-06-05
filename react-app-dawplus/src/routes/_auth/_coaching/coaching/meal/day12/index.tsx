import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { useDialog } from "@/hooks/useDialog";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { Day12Step1, type Day12Step1Data } from "./step1";
import { Day12Step2 } from "./step2";
import { Day12Step3, type Day12Step3Data } from "./step3";

export const Route = createFileRoute("/_auth/_coaching/coaching/meal/day12/")({
  component: RouteComponent,
});

const stepDayCd = "12";

function RouteComponent() {
  const { alert } = useDialog();
  const { pt } = usePageTranslation("coaching/meal/day12");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/meal",
    successMessage: pt("MSG_048"),
    errorMessage: pt("MSG_049"),
  });

  const [step1, setStep1] = useState<Day12Step1Data>({
    value: [],
  });
  const [step3, setStep3] = useState<Day12Step3Data>({
    value: [],
  });

  const buildPayload = (): SaveCoachingAnswerInput[] => {
    return [
      ...step1.value.map((value) => ({
        progressTypeCd: "A1",
        answerChoice: value,
        categoryCd: "B",
        stepDayCd,
        answerChoiceSeq: 0,
      })),
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
      await alert(pt("MSG_027"));
      return;
    }

    await saveAndNavigate(buildPayload());
  };

  return (
    <DayStepFlow
      title={pt("MSG_001")}
      showNextButton={(currentStep) =>
        currentStep !== 1 || step1.value.length > 0
      }
      showFooter
      onSave={saveAnswer}
    >
      <Day12Step1 data={step1} onChange={setStep1} />
      <Day12Step2 step1Data={step1.value} />
      <Day12Step3
        step1={step1.value}
        step3={step3}
        onChange={setStep3}
        onSave={saveAnswer}
      />
    </DayStepFlow>
  );
}
