import type { ReactNode } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import {
  createEmptyCoachingEntry,
  createTextCoachingEntry,
} from "../../-lib/coachingPayload";
import type { FinalMealDayConfig } from "./FinalMealDayPage";

type PtFn = (key: string, opts?: Record<string, unknown>) => string;

export interface FinalMealDayConfigInput {
  dayCd: string;
  titleKey: string;
  ttsKeys: [string, string, string];
  step1IntroKey: string;
  step1QuestionKey: string;
  step1Options: string[];
  step1ErrorKey: string;
  step2TitleKey: string;
  step2Image: string;
  step2Body: ReactNode;
  step3MissionKey: string;
  step3Body: ReactNode;
}

export const createFinalMealPayload =
  (dayCd: string) =>
  (state: { step1: string }): SaveCoachingAnswerInput[] => {
    return [
      createTextCoachingEntry("A1", "B", dayCd, state.step1),
      createEmptyCoachingEntry("A2", "B", dayCd),
      createEmptyCoachingEntry("A3", "B", dayCd),
    ];
  };

export const resolveFinalMealDayConfig = (
  pt: PtFn,
  input: FinalMealDayConfigInput,
): FinalMealDayConfig => {
  return {
    dayCd: input.dayCd,
    title: pt(input.titleKey),
    tts: {
      step1: pt(input.ttsKeys[0]),
      step2: pt(input.ttsKeys[1]),
      step3: pt(input.ttsKeys[2]),
    },
    step1Intro: pt(input.step1IntroKey),
    step1Question: pt(input.step1QuestionKey),
    step1Options: input.step1Options.map((key) => pt(key)),
    step1Error: pt(input.step1ErrorKey),
    step2Title: pt(input.step2TitleKey),
    step2Image: input.step2Image,
    step2Body: input.step2Body,
    step3Mission: pt(input.step3MissionKey),
    step3Body: input.step3Body,
    buildPayload: createFinalMealPayload(input.dayCd),
  };
};
