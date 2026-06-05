import type { ReactNode } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import {
  createEmptyCoachingEntry,
  createTextCoachingEntries,
} from "../../-lib/coachingPayload";
import type {
  SelectableMealDayConfig,
  SelectableMealDayState,
} from "./SelectableMealDayPage";

type PtFn = (key: string, opts?: Record<string, unknown>) => string;

export interface SelectableMealDayConfigInput {
  dayCd: string;
  titleKey: string;
  ttsKeys: [string, string, string];
  step1IntroKey: string;
  step1QuestionKey: string;
  step1Options: string[];
  step1Multiple?: boolean;
  step1ErrorKey: string;
  step2TitleKey: string;
  step2Image: string | ((state: SelectableMealDayState) => string);
  step2SubtitleKey?: string;
  step2Body: (state: SelectableMealDayState) => ReactNode;
  step3MissionKey: string;
  step3QuestionKey: string;
  step3Options: string[] | ((state: SelectableMealDayState) => string[]);
  step3ErrorKey: string;
  step3ClosingKey?: string;
}

export const createSelectableMealPayload =
  (dayCd: string) =>
  (state: SelectableMealDayState): SaveCoachingAnswerInput[] => {
    const step1Values = Array.isArray(state.step1)
      ? state.step1
      : [state.step1];

    return [
      ...createTextCoachingEntries("A1", "B", dayCd, step1Values),
      createEmptyCoachingEntry("A2", "B", dayCd),
      ...createTextCoachingEntries("A3", "B", dayCd, state.step3),
    ];
  };

export const resolveSelectableMealDayConfig = (
  pt: PtFn,
  input: SelectableMealDayConfigInput,
): SelectableMealDayConfig => {
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
    step1Options: input.step1Options,
    step1Multiple: input.step1Multiple,
    step1Error: pt(input.step1ErrorKey),
    step2Title: pt(input.step2TitleKey),
    step2Image: input.step2Image,
    step2Subtitle: input.step2SubtitleKey
      ? pt(input.step2SubtitleKey)
      : undefined,
    step2Body: input.step2Body,
    step3Mission: pt(input.step3MissionKey),
    step3Question: pt(input.step3QuestionKey),
    step3Options: input.step3Options,
    step3Error: pt(input.step3ErrorKey),
    step3Closing: input.step3ClosingKey ? pt(input.step3ClosingKey) : undefined,
    buildPayload: createSelectableMealPayload(input.dayCd),
  };
};
