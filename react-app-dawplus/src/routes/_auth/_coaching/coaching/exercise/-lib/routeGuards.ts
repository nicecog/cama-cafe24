import type { WebviewExerciseContentItem } from "@/apis/types";

export function canEnterExerciseVideo(
  selectedWorkout: WebviewExerciseContentItem | null,
) {
  return selectedWorkout !== null;
}

export function canEnterExerciseResult(params: {
  cancer: string;
  answers: string[];
}) {
  return (
    !!params.cancer && params.answers.length > 0 && !params.answers.includes("")
  );
}
