import type { WebviewUserAnswerInfo } from "@/apis/types";

const normalizeVisibleText = (value: string | null | undefined) => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
};

export const getDisplayValue = (answer: WebviewUserAnswerInfo) => {
  return (
    normalizeVisibleText(answer.answerChoice) ??
    normalizeVisibleText(answer.refVal1) ??
    normalizeVisibleText(answer.refVal2)
  );
};

export const hasDisplayableAnswer = (answer: WebviewUserAnswerInfo) => {
  return getDisplayValue(answer) !== null;
};

export const toDisplayableAnswers = (answers: WebviewUserAnswerInfo[]) => {
  return answers.filter(hasDisplayableAnswer);
};
