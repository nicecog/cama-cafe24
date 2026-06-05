import type { ReactNode } from "react";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import {
  createCoachingEntry,
  createEmptyCoachingEntry,
} from "../../-lib/coachingPayload";
import type {
  StandardSleepDayConfig,
  StandardSleepDayState,
} from "./StandardSleepDayPage";

type PtFn = (key: string, opts?: Record<string, unknown>) => string;

export interface StandardSleepDayConfigInput {
  dayCd: string;
  titleKey: string;
  ttsKeys: [string, string, string];
  step1IntroKey: string;
  step1ErrorKey: string;
  showCharacter?: boolean;
  sleepTitleKey: string;
  sleepHintKey: string;
  ratingTitleKey: string;
  ratingHintKey: string;
  step1Top?: ReactNode;
  step2TitleKey: string;
  step2Image: string;
  step2ParagraphKeys: string[];
  step3MissionKey: string;
  step3ParagraphKeys: string[];
}

export const createStandardSleepPayload =
  (dayCd: string) =>
  (state: StandardSleepDayState): SaveCoachingAnswerInput[] => {
    return [
      createCoachingEntry({
        progressTypeCd: "D1",
        categoryCd: "D",
        stepDayCd: dayCd,
        answerChoice: `기록 : ${state.sleep}`,
        refVal1: state.sleep,
      }),
      createCoachingEntry({
        progressTypeCd: "D1",
        categoryCd: "D",
        stepDayCd: dayCd,
        answerChoice: `점수 : ${state.rating}`,
        refVal1: state.rating,
      }),
      createEmptyCoachingEntry("D2", "D", dayCd),
      createEmptyCoachingEntry("D3", "D", dayCd),
    ];
  };

export const resolveStandardSleepDayConfig = (
  pt: PtFn,
  input: StandardSleepDayConfigInput,
): StandardSleepDayConfig => {
  return {
    dayCd: input.dayCd,
    title: pt(input.titleKey),
    tts: {
      step1: pt(input.ttsKeys[0]),
      step2: pt(input.ttsKeys[1]),
      step3: pt(input.ttsKeys[2]),
    },
    step1Intro: pt(input.step1IntroKey),
    step1Error: pt(input.step1ErrorKey),
    showCharacter: input.showCharacter,
    sleepTitle: pt(input.sleepTitleKey),
    sleepHint: pt(input.sleepHintKey),
    ratingTitle: pt(input.ratingTitleKey),
    ratingHint: pt(input.ratingHintKey),
    step1Top: input.step1Top,
    step2Title: pt(input.step2TitleKey),
    step2Image: input.step2Image,
    step2Paragraphs: input.step2ParagraphKeys.map((key) => pt(key)),
    step3Mission: pt(input.step3MissionKey),
    step3Paragraphs: input.step3ParagraphKeys.map((key) => pt(key)),
    buildPayload: createStandardSleepPayload(input.dayCd),
  };
};
