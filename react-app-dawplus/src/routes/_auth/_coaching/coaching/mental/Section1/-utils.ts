import { mentalTypeMetaMap } from "./-constants";
import type { MentalAnswerValue, MentalTypeResult } from "./-types";

const tieBreakOrder: MentalTypeResult["dispName"][] = [
  "걱정형",
  "자포자기형",
  "억압형",
  "전투형",
  "순응형",
];

export function evaluateMentalType(rawAnswers: number[]): MentalTypeResult {
  const scores: MentalTypeResult[] = [
    {
      type: "불안몰두",
      dispName: "걱정형",
      score: rawAnswers[2] * 2 + rawAnswers[3],
    },
    {
      type: "무망감/무력감",
      dispName: "자포자기형",
      score: rawAnswers[0] * 2 + rawAnswers[1],
    },
    {
      type: "인지적회피",
      dispName: "억압형",
      score: rawAnswers[4] * 2 + rawAnswers[5],
    },
    {
      type: "투쟁정신",
      dispName: "전투형",
      score: rawAnswers[6] * 2 + rawAnswers[7],
    },
    {
      type: "운명론",
      dispName: "순응형",
      score: rawAnswers[8] * 2 + rawAnswers[9],
    },
  ];

  return scores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return tieBreakOrder.indexOf(a.dispName) - tieBreakOrder.indexOf(b.dispName);
  })[0];
}

export function hasCompletedMentalChecklist(answers: MentalAnswerValue[]) {
  return answers.every((value) => value !== null);
}

export function getMentalTypeMeta(type: MentalTypeResult["dispName"]) {
  return mentalTypeMetaMap[type];
}
