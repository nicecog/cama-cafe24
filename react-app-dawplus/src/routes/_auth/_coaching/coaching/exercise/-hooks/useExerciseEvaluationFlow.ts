import { useAtom } from "jotai";
import { startTransition, useMemo } from "react";
import type { CancerTypeName } from "../-constants/exerciseCodeMap";
import { getQuestionSet } from "../-constants/exerciseQuestions";
import {
  exerciseAnswersAtom,
  resetExerciseFlowAtom,
  selectedCancerAtom,
} from "../-state/exerciseAtoms";

export function useExerciseEvaluationFlow() {
  const [selectedCancer, setSelectedCancer] = useAtom(selectedCancerAtom);
  const [answers, setAnswers] = useAtom(exerciseAnswersAtom);
  const [, resetFlow] = useAtom(resetExerciseFlowAtom);

  const questions = useMemo(
    () => (selectedCancer ? getQuestionSet(selectedCancer) : []),
    [selectedCancer],
  );

  const currentIndex = answers.indexOf("");
  const isComplete = questions.length > 0 && currentIndex === -1;

  const selectCancer = (cancer: CancerTypeName) => {
    startTransition(() => {
      setSelectedCancer(cancer);
      setAnswers(Array(getQuestionSet(cancer).length).fill(""));
    });
  };

  const answerCurrent = (value: "Y" | "N") => {
    if (currentIndex < 0) return;

    startTransition(() => {
      setAnswers((prev) =>
        prev.map((answer, index) => (index === currentIndex ? value : answer)),
      );
    });
  };

  return {
    selectedCancer,
    questions,
    answers,
    currentIndex,
    isComplete,
    selectCancer,
    answerCurrent,
    resetFlow,
  };
}
