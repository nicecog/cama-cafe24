import type { WebviewExerciseContentItem } from "@/apis/types";
import {
  type CancerTypeCode,
  type DifficultyCode,
  THERAPY_EXERCISE_TYPE_CODE,
  type TherapyCode,
} from "../-constants/exerciseCodeMap";

interface BuildExerciseRecommendationRefsParams {
  contentList: WebviewExerciseContentItem[];
  cancerTypeCd: CancerTypeCode;
  exerciseProgramCd: DifficultyCode;
  aerobic: "Y" | "N";
  therapyCd: TherapyCode | "";
}

function toExerciseRef(item: WebviewExerciseContentItem) {
  return `${item.indexNum}${item.exerciseTypeCd}${item.difficultyCd}`;
}

export function buildExerciseRecommendationRefs({
  contentList,
  cancerTypeCd,
  exerciseProgramCd,
  aerobic,
  therapyCd,
}: BuildExerciseRecommendationRefsParams) {
  const filteredByDifficulty = contentList.filter(
    (item) => item.difficultyCd === exerciseProgramCd,
  );

  const cancerContent = filteredByDifficulty.filter(
    (item) => item.exerciseTypeCd === cancerTypeCd,
  );
  const commonContent = filteredByDifficulty.filter(
    (item) => item.exerciseTypeCd === "E5",
  );
  const aerobicContent =
    aerobic === "Y"
      ? filteredByDifficulty.filter((item) => item.exerciseTypeCd === "E6")
      : [];
  const therapyExerciseTypeCd = therapyCd
    ? THERAPY_EXERCISE_TYPE_CODE[therapyCd]
    : null;
  const therapyContent = therapyExerciseTypeCd
    ? contentList.filter(
        (item) => item.exerciseTypeCd === therapyExerciseTypeCd,
      )
    : [];

  return [
    ...cancerContent,
    ...commonContent,
    ...aerobicContent,
    ...therapyContent,
  ].map(toExerciseRef);
}
