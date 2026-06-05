import { type ReactNode, useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { useToast } from "@/hooks/use-toast";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export interface FinalMealDayConfig {
  dayCd: string;
  title: string;
  tts: {
    step1: string;
    step2: string;
    step3: string;
  };
  step1Intro: string;
  step1Question: string;
  step1Options: string[];
  step1Error: string;
  step2Title: string;
  step2Image: string;
  step2Body: ReactNode;
  step3Mission: string;
  step3Body: ReactNode;
  buildPayload: (state: { step1: string }) => SaveCoachingAnswerInput[];
}

export function FinalMealDayPage({ config }: { config: FinalMealDayConfig }) {
  const { toast } = useToast();
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/meal",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });
  const [step1, setStep1] = useState("");

  const handleBeforeNext = (currentStep: number) => {
    if (currentStep === 1 && !step1.trim()) {
      toast({
        variant: "destructive",
        description: config.step1Error,
      });
      return false;
    }

    return true;
  };

  const saveAnswer = async () => {
    if (!step1.trim()) {
      toast({
        variant: "destructive",
        description: config.step1Error,
      });
      return;
    }

    await saveAndNavigate(config.buildPayload({ step1 }));
  };

  return (
    <DayStepFlow
      title={config.title}
      ttsTexts={{
        1: config.tts.step1,
        2: config.tts.step2,
        3: config.tts.step3,
      }}
      showNextButton={(currentStep) =>
        currentStep !== 1 || Boolean(step1.trim())
      }
      onBeforeNext={handleBeforeNext}
      onSave={saveAnswer}
    >
      <div className="flex flex-col gap-5">
        <ChallengeStart type="meal">
          <Textbox className="font-semibold">{config.step1Intro}</Textbox>
        </ChallengeStart>

        <ChallengeQuestion
          title={config.step1Question}
          options={config.step1Options}
          value={step1}
          onChange={setStep1}
          className="mt-2"
        />
      </div>

      <CoachingInfoStep title={config.step2Title} image={config.step2Image}>
        <div className="space-y-4">{config.step2Body}</div>
      </CoachingInfoStep>

      <div>
        <TodayMission text={config.step3Mission} />
        <div className="mt-4 space-y-4">{config.step3Body}</div>
      </div>
    </DayStepFlow>
  );
}
