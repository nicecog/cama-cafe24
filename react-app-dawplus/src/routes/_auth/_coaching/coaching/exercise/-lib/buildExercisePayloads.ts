import type {
  SaveCoachingAnswerParams,
  SaveExerciseUserClassParams,
  WebviewUserAnswerInfo,
} from "@/apis/types";

export function buildExerciseUserClassPayload(
  params: SaveExerciseUserClassParams,
) {
  return params;
}

export function buildExerciseSurveyResult(params: {
  questions: string[];
  answers: string[];
}) {
  const { questions, answers } = params;

  return questions.map((question, seq) => ({
    seq,
    question,
    answer: answers[seq] ?? "",
  }));
}

export function buildExerciseSeedPayload(params: {
  accountName: string;
  loginId: string;
  refs: string[];
}): SaveCoachingAnswerParams[] {
  const { accountName, loginId, refs } = params;

  return refs.map((refVal1) => ({
    accountName,
    answerChoice: "N",
    answerChoiceSeq: 0,
    categoryCd: "E",
    loginId,
    progressTypeCd: "A1",
    refVal1,
    stepDayCd: "00",
  }));
}

export function buildExerciseCompletionPayload(params: {
  accountName: string;
  answerList: WebviewUserAnswerInfo[];
  loginId: string;
  selectedRef: string;
}): SaveCoachingAnswerParams[] {
  const { accountName, answerList, loginId, selectedRef } = params;

  return answerList.map((item) => ({
    ...item,
    loginId,
    accountName,
    answerChoice:
      item.refVal1 === selectedRef ? "Y" : (item.answerChoice ?? "N"),
    answerChoiceSeq: item.answerChoiceSeq ?? 0,
    progressTypeCd: item.progressTypeCd ?? "A1",
    refVal1: item.refVal1 ?? "",
  })) as SaveCoachingAnswerParams[];
}
