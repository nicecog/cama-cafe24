import type { ReactNode } from "react";
import { useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { useToast } from "@/hooks/use-toast";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";
import { SelectableList } from "../-components/SelectableList";

export interface SelectableMealDayState {
  step1: string | string[];
  step3: string[];
}

export interface SelectableMealDayConfig {
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
  step1Multiple?: boolean;
  step1Error: string;
  step2Title: ReactNode;
  step2Image: string | ((state: SelectableMealDayState) => string);
  step2Subtitle?: ReactNode;
  step2Body: (state: SelectableMealDayState) => ReactNode;
  step3Mission: ReactNode;
  step3Question: ReactNode;
  step3Options: string[] | ((state: SelectableMealDayState) => string[]);
  step3Error: string;
  step3Closing?: ReactNode;
  buildPayload: (state: SelectableMealDayState) => SaveCoachingAnswerInput[];
}

export function SelectableMealDayPage({
  config,
}: {
  config: SelectableMealDayConfig;
}) {
  const { toast } = useToast();
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/meal",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });

  const [state, setState] = useState<SelectableMealDayState>({
    step1: config.step1Multiple ? [] : "",
    step3: [],
  });

  const step1Selected = Array.isArray(state.step1)
    ? state.step1.length > 0
    : Boolean(state.step1.trim());

  const handleBeforeNext = (currentStep: number) => {
    if (currentStep === 1 && !step1Selected) {
      toast({
        description: config.step1Error,
      });
      return false;
    }

    return true;
  };

  const saveAnswer = async () => {
    if (state.step3.length === 0) {
      toast({
        variant: "destructive",
        description: config.step3Error,
      });
      return;
    }

    await saveAndNavigate(config.buildPayload(state));
  };

  const step2Image =
    typeof config.step2Image === "function"
      ? config.step2Image(state)
      : config.step2Image;
  const step3Options =
    typeof config.step3Options === "function"
      ? config.step3Options(state)
      : config.step3Options;

  return (
    <DayStepFlow
      title={config.title}
      ttsTexts={{
        1: config.tts.step1,
        2: config.tts.step2,
        3: config.tts.step3,
      }}
      showNextButton={(currentStep) => currentStep !== 1 || step1Selected}
      onBeforeNext={handleBeforeNext}
      onSave={saveAnswer}
    >
      <div className="flex flex-col gap-5">
        <ChallengeStart type="meal">
          <Textbox className="font-semibold">{config.step1Intro}</Textbox>
        </ChallengeStart>

        <Textbox className="text-center font-bold text-slate-800">
          {config.step1Question}
        </Textbox>

        <SelectableList
          options={config.step1Options}
          value={state.step1}
          multiple={config.step1Multiple}
          onChange={(value) =>
            setState((prev) => ({
              ...prev,
              step1: value,
            }))
          }
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
        </Textbox>

        <SelectableList
          options={step3Options}
          value={state.step3}
          multiple
          onChange={(value) =>
            setState((prev) => ({
              ...prev,
              step3: Array.isArray(value) ? value : [value],
            }))
          }
          className="mt-4"
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
