import type { WebviewUserAnswerInfo } from "@/apis/types";

export type MentalCompatType =
  | "전투형"
  | "순응형"
  | "억압형"
  | "자포자기형"
  | "걱정형";

export const mentalTypeCodeMap: Record<MentalCompatType, string> = {
  전투형: "E",
  순응형: "F",
  억압형: "G",
  자포자기형: "H",
  걱정형: "J",
};

export function getMentalTypeFromAnswerList(
  answerList: WebviewUserAnswerInfo[],
): MentalCompatType | "" {
  const type = answerList.find(
    (item) => item.stepDayCd === "Q1" && item.progressTypeCd === "D2",
  )?.answerChoice;

  if (
    type === "전투형" ||
    type === "순응형" ||
    type === "억압형" ||
    type === "자포자기형" ||
    type === "걱정형"
  ) {
    return type;
  }

  return "";
}

export function getMentalTypeCode(type: string) {
  if (
    type === "전투형" ||
    type === "순응형" ||
    type === "억압형" ||
    type === "자포자기형" ||
    type === "걱정형"
  ) {
    return mentalTypeCodeMap[type];
  }

  return "";
}
