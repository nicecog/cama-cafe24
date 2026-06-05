import type { WebviewUserAnswerInfo } from "@/apis/types";

export interface Day16Step1Data {
  time: string;
  rating: string;
  answer: string;
}

export interface Day16Averages {
  time: string;
  rating: string;
}

const getFirstNumberFromAnswerChoice = (answerChoice: string | null) => {
  const match = answerChoice?.match(/\d+(?:\.\d+)?/);

  return Number(match?.[0] ?? 0);
};

export const getDay16Averages = (
  answerList: WebviewUserAnswerInfo[],
): Day16Averages => {
  const timeValues = answerList
    .filter((item) => item.answerChoice?.includes("수면 시간"))
    .map((item) => getFirstNumberFromAnswerChoice(item.answerChoice))
    .filter((value) => !Number.isNaN(value));

  const ratingValues = answerList
    .filter((item) => item.answerChoice?.includes("수면점수"))
    .map((item) => getFirstNumberFromAnswerChoice(item.answerChoice))
    .filter((value) => !Number.isNaN(value));

  const time =
    timeValues.length > 0
      ? (
          timeValues.reduce((acc, value) => acc + value, 0) / timeValues.length
        ).toFixed(1)
      : "0.0";
  const rating =
    ratingValues.length > 0
      ? (
          ratingValues.reduce((acc, value) => acc + value, 0) /
          ratingValues.length
        ).toFixed(1)
      : "0.0";

  return { time, rating };
};
