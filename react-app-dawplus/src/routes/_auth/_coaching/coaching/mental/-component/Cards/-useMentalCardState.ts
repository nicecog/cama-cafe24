import { useEffect, useMemo, useState } from "react";
import type { MentalCardAnswer } from "./-types";

export function useMentalCardState(totalSteps: number) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<MentalCardAnswer[]>([]);

  useEffect(() => {
    if (!step) return;
    if (document.body.dataset.mentalDevBridgeNoScroll === "true") {
      return;
    }
    document.getElementById("main-container")?.scrollTo(0, 0);
  }, [step]);

  const currentStepCode = String(step).padStart(2, "0");

  const currentAnswers = useMemo(
    () =>
      answers
        .filter((item) => item.progressTypeCd === currentStepCode)
        .map((item) => item.answerChoice),
    [answers, currentStepCode],
  );

  const setSingleAnswer = (value: string) => {
    setAnswers((prev) =>
      prev
        .filter((item) => item.progressTypeCd !== currentStepCode)
        .concat({ progressTypeCd: currentStepCode, answerChoice: value }),
    );
  };

  const toggleAnswer = (value: string) => {
    setAnswers((prev) => {
      const hasValue = prev.some(
        (item) =>
          item.progressTypeCd === currentStepCode &&
          item.answerChoice === value,
      );

      if (hasValue) {
        return prev.filter(
          (item) =>
            item.progressTypeCd !== currentStepCode ||
            item.answerChoice !== value,
        );
      }

      return prev.concat({
        progressTypeCd: currentStepCode,
        answerChoice: value,
      });
    });
  };

  const next = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prev = () => setStep((prev) => Math.max(prev - 1, 1));

  return {
    answers,
    currentAnswers,
    next,
    prev,
    setSingleAnswer,
    step,
    toggleAnswer,
  };
}
