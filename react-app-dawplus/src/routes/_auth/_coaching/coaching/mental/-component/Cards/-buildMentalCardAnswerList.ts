import type { SaveCoachingAnswerParams } from "@/apis/types";
import { mentalAnswerTemplateByDay } from "./-constants";
import type { MentalCardAnswer, MentalCardUserType } from "./-types";

interface BuildMentalCardAnswerListParams {
  accountName: string;
  answers: MentalCardAnswer[];
  categoryCd?: string;
  dayCode: keyof typeof mentalAnswerTemplateByDay;
  loginId: string;
  stepDayCd: string;
  type: MentalCardUserType;
}

export function buildMentalCardAnswerList({
  accountName,
  answers,
  categoryCd = "D",
  dayCode,
  loginId,
  stepDayCd,
  type,
}: BuildMentalCardAnswerListParams): SaveCoachingAnswerParams[] {
  const prefix =
    {
      전투형: "E",
      순응형: "F",
      억압형: "G",
      자포자기형: "H",
      걱정형: "J",
    }[type] ?? "";

  const normalized = answers.map((item) => ({
    ...item,
    progressTypeCd: `${prefix}${item.progressTypeCd}`,
  }));

  const template = mentalAnswerTemplateByDay[dayCode] ?? [];

  return normalized
    .concat(
      template.filter(
        (templateItem) =>
          !normalized.some(
            (answer) => answer.progressTypeCd === templateItem.progressTypeCd,
          ),
      ),
    )
    .map((item) => ({
      accountName,
      answerChoice: item.answerChoice,
      answerChoiceSeq: 0,
      categoryCd,
      loginId,
      progressTypeCd: item.progressTypeCd,
      stepDayCd,
    }))
    .sort((a, b) => b.progressTypeCd.localeCompare(a.progressTypeCd));
}
