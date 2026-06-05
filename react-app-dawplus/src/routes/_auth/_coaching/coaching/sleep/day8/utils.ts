import type { WebviewUserAnswerInfo } from "@/apis/types";

export interface Day8Step1Data {
  sleep: string;
  rating: string;
  answer: string;
}

export interface Day8PreviousDaySummary {
  targetTime: string;
  sleepTime: string;
}

export const getDay8PreviousDaySummary = (
  answerList: WebviewUserAnswerInfo[],
): Day8PreviousDaySummary => {
  const targetTime = answerList.find(
    (item) =>
      item.stepDayCd === "03" && item.answerChoice?.includes("총수면 시간"),
  )?.answerChoice;

  const sleepTime = answerList.find(
    (item) =>
      item.stepDayCd === "03" && item.answerChoice?.includes("취침시간"),
  )?.answerChoice;

  const targetTimeNumber = targetTime?.match(/\d+/g)?.[0] ?? "0";
  const sleepTimeNumber = sleepTime?.match(/\d+/g)?.[0] ?? "0";

  return {
    targetTime: targetTimeNumber,
    sleepTime: sleepTimeNumber,
  };
};
