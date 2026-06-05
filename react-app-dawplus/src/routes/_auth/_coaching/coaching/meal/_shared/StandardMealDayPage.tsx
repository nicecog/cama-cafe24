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

export interface StandardMealDayState {
  step1: string;
  step3: string;
}

export interface StandardMealDayConfig {
  dayCd: string;
  title: string;
  tts: {
    step1: string;
    step2: string;
    step3: string;
  };
  step1Intro: ReactNode;
  step1Question: ReactNode;
  step1Options: string[];
  step1Error: string;
  step2Title: ReactNode;
  step2Image: string | ((state: StandardMealDayState) => string);
  step2Subtitle?: ReactNode;
  step2Body: (state: StandardMealDayState) => ReactNode;
  step3Mission: ReactNode;
  step3Question: ReactNode;
  step3Example?: ReactNode;
  step3InputPrefix?: ReactNode;
  step3Closing?: ReactNode;
  buildPayload: (state: StandardMealDayState) => SaveCoachingAnswerInput[];
}

export function StandardMealDayPage({
  config,
}: {
  config: StandardMealDayConfig;
}) {
  const { toast } = useToast();
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/meal",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });

  const [state, setState] = useState<StandardMealDayState>({
    step1: "",
    step3: "",
  });

  const handleBeforeNext = (currentStep: number) => {
    if (currentStep === 1 && !state.step1.trim()) {
      toast({
        description: config.step1Error,
      });
      return false;
    }

    return true;
  };

  const saveAnswer = async () => {
    if (!state.step3.trim()) {
      toast({
        variant: "destructive",
        description: "오늘의 실천 내용을 입력해 주세요.",
      });
      return;
    }

    await saveAndNavigate(config.buildPayload(state));
  };

  const step2Image =
    typeof config.step2Image === "function"
      ? config.step2Image(state)
      : config.step2Image;

  return (
    <DayStepFlow
      title={config.title}
      ttsTexts={{
        1: config.tts.step1,
        2: config.tts.step2,
        3: config.tts.step3,
      }}
      showNextButton={(currentStep) =>
        currentStep !== 1 || Boolean(state.step1.trim())
      }
      onBeforeNext={handleBeforeNext}
      onSave={saveAnswer}
    >
      <div className="flex flex-col gap-5">
        <ChallengeStart type="meal">
          <Textbox className="font-semibold">{config.step1Intro}</Textbox>
        </ChallengeStart>

        <ChallengeQuestion
          title={config.step1Question as string}
          options={config.step1Options}
          value={state.step1}
          onChange={(value) => setState((prev) => ({ ...prev, step1: value }))}
          className="mt-2"
        />
      </div>

      <CoachingInfoStep
        title={config.step2Title}
        image={step2Image}
        subtitle={config.step2Subtitle}
      >
        <div className="space-y-4">{config.step2Body(state)}</div>
      </CoachingInfoStep>

      <div>
        <TodayMission text={config.step3Mission} />
        <Textbox className="mt-4 text-center font-bold">
          {config.step3Question}
          {config.step3Example ? (
            <>
              <br />
              <span className="text-sm font-semibold text-slate-600">
                {config.step3Example}
              </span>
            </>
          ) : null}
        </Textbox>

        {config.step3InputPrefix ? (
          <Textbox className="mt-4 text-center font-bold text-primary">
            {config.step3InputPrefix}
          </Textbox>
        ) : null}

        <textarea
          value={state.step3}
          onChange={(event) =>
            setState((prev) => ({ ...prev, step3: event.target.value }))
          }
          className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-relaxed text-slate-800 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          placeholder="오늘 할 수 있는 작은 실천을 적어 보세요."
        />

        {config.step3Closing ? (
          <Textbox className="mt-4 text-slate-700">
            {config.step3Closing}
          </Textbox>
        ) : null}
      </div>
    </DayStepFlow>
  );
}
