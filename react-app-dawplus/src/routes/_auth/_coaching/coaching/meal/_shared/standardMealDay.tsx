import type { ReactNode } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import {
  createEmptyCoachingEntry,
  createTextCoachingEntry,
} from "../../-lib/coachingPayload";
import type {
  StandardMealDayConfig,
  StandardMealDayState,
} from "./StandardMealDayPage";

type PtFn = (key: string, opts?: Record<string, unknown>) => string;

export interface StandardMealDayConfigInput {
  dayCd: string;
  titleKey: string;
  ttsKeys: [string, string, string];
  step1IntroKey: string;
  step1QuestionKey: string;
  step1Options: [string, string];
  step1ErrorKey: string;
  step2TitleKey: string;
  step2Image: string | ((state: StandardMealDayState) => string);
  step2SubtitleKey?: string;
  step2Body: (state: StandardMealDayState) => ReactNode;
  step3MissionKey: string;
  step3QuestionKey: string;
  step3ExampleKey?: string;
  step3InputPrefixKey?: string;
  step3ClosingKey?: string;
}

export const createStandardMealPayload =
  (dayCd: string) =>
  (state: StandardMealDayState): SaveCoachingAnswerInput[] => {
    return [
      createTextCoachingEntry("A1", "B", dayCd, state.step1),
      createEmptyCoachingEntry("A2", "B", dayCd),
      createTextCoachingEntry("A3", "B", dayCd, state.step3),
    ];
  };

export const resolveStandardMealDayConfig = (
  pt: PtFn,
  input: StandardMealDayConfigInput,
): StandardMealDayConfig => {
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
    step1Options: [pt(input.step1Options[0]), pt(input.step1Options[1])],
    step1Error: pt(input.step1ErrorKey),
    step2Title: pt(input.step2TitleKey),
    step2Image: input.step2Image,
    step2Subtitle: input.step2SubtitleKey
      ? pt(input.step2SubtitleKey)
      : undefined,
    step2Body: input.step2Body,
    step3Mission: pt(input.step3MissionKey),
    step3Question: pt(input.step3QuestionKey),
    step3Example: input.step3ExampleKey ? pt(input.step3ExampleKey) : undefined,
    step3InputPrefix: input.step3InputPrefixKey
      ? pt(input.step3InputPrefixKey)
      : undefined,
    step3Closing: input.step3ClosingKey ? pt(input.step3ClosingKey) : undefined,
    buildPayload: createStandardMealPayload(input.dayCd),
  };
};
