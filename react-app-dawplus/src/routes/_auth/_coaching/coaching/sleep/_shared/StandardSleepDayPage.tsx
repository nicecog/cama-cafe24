import { motion } from "framer-motion";
import { type ReactNode, useState } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { useToast } from "@/hooks/use-toast";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import SleepCheck from "../../-components/elements/SleepCheck";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export interface StandardSleepDayState {
  sleep: string;
  rating: string;
}

export interface StandardSleepDayConfig {
  dayCd: string;
  title: string;
  tts: {
    step1: string;
    step2: string;
    step3: string;
  };
  step1Intro: string;
  step1Error: string;
  showCharacter?: boolean;
  sleepTitle: string;
  sleepHint: string;
  ratingTitle: string;
  ratingHint: string;
  step1Top?: ReactNode;
  step2Title: string;
  step2Image: string;
  step2Paragraphs: ReactNode[];
  step3Mission: string;
  step3Paragraphs: ReactNode[];
  buildPayload: (state: StandardSleepDayState) => SaveCoachingAnswerInput[];
}

export function StandardSleepDayPage({
  config,
}: {
  config: StandardSleepDayConfig;
}) {
  const { toast } = useToast();
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/sleep",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });

  const [state, setState] = useState<StandardSleepDayState>({
    sleep: "1",
    rating: "0",
  });

  const onBeforeNext = (currentStep: number) => {
    if (currentStep === 1) {
      const isMissing = !state.sleep.trim() || !state.rating.trim();

      if (isMissing) {
        toast({
          description: config.step1Error,
        });
        return false;
      }
    }

    return true;
  };

  const saveAnswer = async () => {
    await saveAndNavigate(config.buildPayload(state));
  };

  return (
    <DayStepFlow
      title={config.title}
      ttsTexts={{
        1: config.tts.step1,
        2: config.tts.step2,
        3: config.tts.step3,
      }}
      onBeforeNext={onBeforeNext}
      onSave={saveAnswer}
      showNextButton={(currentStep) =>
        currentStep !== 1 || Boolean(state.sleep.trim() && state.rating.trim())
      }
    >
      <div className="flex flex-col gap-5">
        {config.step1Top}

        <ChallengeStart showCharacter={config.showCharacter}>
          {config.step1Intro}
        </ChallengeStart>

        <SleepCheck
          sleepTitle={config.sleepTitle}
          sleepHint={config.sleepHint}
          ratingTitle={config.ratingTitle}
          ratingHint={config.ratingHint}
          sleep={state.sleep}
          rating={state.rating}
          onChange={(next) => {
            setState((prev) => ({
              sleep: next.sleep ?? prev.sleep,
              rating: next.rating ?? prev.rating,
            }));
          }}
        />
      </div>

      <CoachingInfoStep title={config.step2Title} image={config.step2Image}>
        <div className="flex flex-col gap-6 pt-4 pb-12 w-full max-w-[28rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 px-2 break-keep text-pretty"
          >
            {/* 첫 번째 문장: 소프트 강조 (살짝 크게, 굵게, 중앙 정렬 + 짧은 구분선) */}
            {config.step2Paragraphs.length > 0 && (
              <div className="flex flex-col items-center gap-4 mb-6">
                <p className="text-[17px] font-extrabold text-slate-900 leading-relaxed text-center">
                  {config.step2Paragraphs[0]}
                </p>
                <div className="h-0.5 w-8 rounded-full bg-primary/30" />
              </div>
            )}

            {/* 나머지 문장들: 일반 본문 스타일 */}
            {config.step2Paragraphs.length > 1 && (
              <div className="space-y-4 text-base font-semibold text-slate-600 leading-relaxed">
                {config.step2Paragraphs.slice(1).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </CoachingInfoStep>

      <div className="text-center">
        <TodayMission text={config.step3Mission} />
        <div className="mt-4 space-y-4">
          {config.step3Paragraphs.map((paragraph, index) => (
            <Textbox
              key={index}
              className="leading-relaxed text-slate-700 text-center"
            >
              {paragraph}
            </Textbox>
          ))}
        </div>
      </div>
    </DayStepFlow>
  );
}
