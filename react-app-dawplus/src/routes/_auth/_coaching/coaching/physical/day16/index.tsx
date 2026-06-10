import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { useState } from "react";
import {
  type SaveCoachingAnswerInput,
  useSaveCoachingStep,
} from "@/hooks/mutations";
import { useToast } from "@/hooks/use-toast";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { StepCountPopup } from "../../-components/StepCountPopup";
import { Day16Step1 } from "./step1";
import { Day16Step2 } from "./step2";
import { Day16Step3 } from "./step3";

export const Route = createFileRoute(
  "/_auth/_coaching/coaching/physical/day16/",
)({
  component: RouteComponent,
});

const stepDayCd = "16";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/physical/day16");
  const yesLabel = pt("MSG_044");
  const noLabel = pt("MSG_002");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/physical",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });
  const { mutateAsync: saveCoachingStep } = useSaveCoachingStep();

  const [step1, setStep1] = useState("");
  const [step2, setStep2] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ] as Array<boolean | null>);
  const [step3, setStep3] = useState("");
  const [stepCount, setStepCount] = useState("");
  const [isStepCountPopupOpen, setIsStepCountPopupOpen] = useState(false);

  const DAY16_TTS_TEXT: Record<number, string> = {
    1: pt("MSG_017"),
    2: pt("MSG_021"),
    3: pt("MSG_037"),
  };

  const answers = [pt("MSG_012"), pt("MSG_013"), pt("MSG_014"), pt("MSG_015")];
  const questions = [
    pt("MSG_003"),
    pt("MSG_004"),
    pt("MSG_005"),
    pt("MSG_006"),
    pt("MSG_007"),
    pt("MSG_008"),
  ];
  const infoKeys = [
    "MSG_024",
    "MSG_026",
    "MSG_028",
    "MSG_030",
    "MSG_032",
    "MSG_034",
  ] as const;

  const onBeforeNext = (currentStep: number) => {
    if (currentStep === 1 && !step1.trim()) {
      toast({
        description: pt("MSG_016"),
      });
      return false;
    }

    if (currentStep === 2 && step2.some((item) => item === null)) {
      toast({
        description: pt("MSG_019"),
      });
      return false;
    }

    return true;
  };

  const buildPayload = (): SaveCoachingAnswerInput[] => [
    {
      progressTypeCd: "A1",
      answerChoice: step1,
      categoryCd: "C",
      stepDayCd,
      answerChoiceSeq: 0,
    },
    ...step2.map((item, index) => ({
      progressTypeCd: "A2",
      answerChoice: `${questions[index]} : ${item ? yesLabel : noLabel}`,
      refVal1: item ? "Y" : "N",
      categoryCd: "C",
      stepDayCd,
      answerChoiceSeq: 0,
    })),
    {
      progressTypeCd: "A3",
      answerChoice: step3,
      categoryCd: "C",
      stepDayCd,
      answerChoiceSeq: 0,
    },
  ];

  const saveAnswer = async () => {
    if (!step3.trim()) {
      toast({
        variant: "destructive",
        description: pt("MSG_019"),
      });
      return;
    }

    setIsStepCountPopupOpen(true);
  };

  const handleStepCountConfirm = async (trimmedStepCount: string) => {
    const executionDate = format(new Date(), "yyyy-MM-dd");

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
        title={pt("MSG_001")}
        ttsTexts={DAY16_TTS_TEXT}
        onBeforeNext={onBeforeNext}
        onSave={saveAnswer}
        showNextButton={(currentStep) => currentStep !== 1 || Boolean(step1)}
        showFooter
      >
        <Day16Step1 step1={step1} setStep1={setStep1} answers={answers} />
        <Day16Step2
          step2={step2}
          setStep2={setStep2}
          questions={questions}
          infoKeys={infoKeys}
        />
        <Day16Step3 step3={step3} setStep3={setStep3} />
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
