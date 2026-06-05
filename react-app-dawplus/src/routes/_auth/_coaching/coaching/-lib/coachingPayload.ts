import type { SaveCoachingAnswerInput } from "@/hooks/mutations";

type CoachingProgressType =
  | "A1"
  | "A2"
  | "A3"
  | "B1"
  | "B2"
  | "B3"
  | "C1"
  | "C2"
  | "C3"
  | "D1"
  | "D2"
  | "D3"
  | "E1"
  | "E2"
  | "E3";
type CoachingCategoryCd = "A" | "B" | "C" | "D" | "E";

interface CoachingEntryInput {
  progressTypeCd: CoachingProgressType;
  categoryCd: CoachingCategoryCd;
  stepDayCd: string;
  answerChoice?: string;
  refVal1?: string;
  answerChoiceSeq?: number;
}

export function createCoachingEntry({
  progressTypeCd,
  categoryCd,
  stepDayCd,
  answerChoice = "",
  refVal1,
  answerChoiceSeq = 0,
}: CoachingEntryInput): SaveCoachingAnswerInput {
  return {
    progressTypeCd,
    answerChoice,
    refVal1,
    categoryCd,
    stepDayCd,
    answerChoiceSeq,
  };
}

export function createEmptyCoachingEntry(
  progressTypeCd: CoachingProgressType,
  categoryCd: CoachingCategoryCd,
  stepDayCd: string,
): SaveCoachingAnswerInput {
  return createCoachingEntry({
    progressTypeCd,
    categoryCd,
    stepDayCd,
  });
}

export function createTextCoachingEntry(
  progressTypeCd: CoachingProgressType,
  categoryCd: CoachingCategoryCd,
  stepDayCd: string,
  value: string,
): SaveCoachingAnswerInput {
  return createCoachingEntry({
    progressTypeCd,
    categoryCd,
    stepDayCd,
    answerChoice: value,
    refVal1: value,
  });
}

export function createTextCoachingEntries(
  progressTypeCd: CoachingProgressType,
  categoryCd: CoachingCategoryCd,
  stepDayCd: string,
  values: string[],
): SaveCoachingAnswerInput[] {
  return values.map((value) =>
    createTextCoachingEntry(progressTypeCd, categoryCd, stepDayCd, value),
  );
}
