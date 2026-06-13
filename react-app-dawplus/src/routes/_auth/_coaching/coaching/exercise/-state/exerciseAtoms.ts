import { atom } from "jotai";
import type { WebviewExerciseContentItem } from "@/apis/types";
import type {
  CancerTypeName,
  DifficultyCode,
  TherapyCode,
} from "../-constants/exerciseCodeMap";

export interface ExerciseRecommendationSummary {
  program: DifficultyCode;
  aerobic: "Y" | "N";
  therapy: TherapyCode | "";
}

export const selectedCancerAtom = atom<CancerTypeName | "">("");
export const exerciseAnswersAtom = atom<string[]>([]);
export const selectedWorkoutAtom = atom<WebviewExerciseContentItem | null>(
  null,
);
export const exerciseRecommendationAtom =
  atom<ExerciseRecommendationSummary | null>(null);

export const resetExerciseFlowAtom = atom(null, (_, set) => {
  set(selectedCancerAtom, "");
  set(exerciseAnswersAtom, []);
  set(selectedWorkoutAtom, null);
  set(exerciseRecommendationAtom, null);
});
