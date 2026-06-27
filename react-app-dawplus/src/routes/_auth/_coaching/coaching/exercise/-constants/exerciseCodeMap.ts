export const CANCER_TYPE_CODE = {
  대장암: "E1",
  폐암: "E2",
  유방암: "E3",
  갑상선암: "E4",
} as const;

export const DIFFICULTY_LABEL = {
  A1: "초급",
  A2: "중급",
  A3: "고급",
} as const;

export const THERAPY_LABEL = {
  T1: "음성치료",
  T2: "객담배출/호흡근운동",
  T3: "림프부종 마사지",
} as const;

export const THERAPY_EXERCISE_TYPE_CODE = {
  T1: "E8",
  T2: "E7",
  T3: "E9",
} as const;

export type CancerTypeName = keyof typeof CANCER_TYPE_CODE;
export type CancerTypeCode = (typeof CANCER_TYPE_CODE)[CancerTypeName];
export type DifficultyCode = keyof typeof DIFFICULTY_LABEL;
export type TherapyCode = keyof typeof THERAPY_LABEL;

export function getCancerTypeCode(cancer: CancerTypeName): CancerTypeCode {
  return CANCER_TYPE_CODE[cancer];
}

export function getDifficultyLabel(code: DifficultyCode) {
  return DIFFICULTY_LABEL[code];
}

export function getTherapyLabel(code: TherapyCode) {
  return THERAPY_LABEL[code];
}

export function getExerciseBadgeLabel(
  exerciseTypeCd: string,
  difficultyCd: string,
) {
  const therapyCode = (
    Object.entries(THERAPY_EXERCISE_TYPE_CODE).find(
      ([, typeCode]) => typeCode === exerciseTypeCd,
    )?.[0] ?? ""
  ) as TherapyCode | "";

  if (therapyCode) {
    return "특수";
  }

  return getDifficultyLabel(difficultyCd as DifficultyCode);
}
