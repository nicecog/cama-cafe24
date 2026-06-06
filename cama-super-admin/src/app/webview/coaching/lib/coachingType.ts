export type SleepType = {
  categoryCd: string;
  stepDayCd: string;
  currentStepDayCd: string;
  progressTypeCd: string;
  accountName: string;
  params: QuestionInfoParamType;
  maxDay: string;
  step1Answer: AnswerInfo[];
  step2Answer: AnswerInfo[];
  step3Answer: AnswerInfo[];

  questionList: QuestionInfo[];
  answerList: AnswerInfo[];
  useAnswerList: AnswerInfo[];
};
// 질문조회를 위한 타입
export type QuestionInfoParamType = {
  loginId: string;
  categoryCd: string;
  stepDayCd: string;
  progressTypeCd: string;
  answerTypeCd: string;
};
// 질문정보
export type QuestionInfo = {
  accountName: string;
  answerTypeCd: string;
  categoryCd: string;
  contentsInfo: string;
  loginId: null | string;
  progressTypeCd: string;
  question: string;
  questionAnswerCnt: number | string;
  stepDayCd: string;
};

// 답변 타입
export type AnswerInfo = {
  categoryCd: string;
  stepDayCd: string;
  progressTypeCd: string;
  detailSeq: number;
  detailInfo: string;
  addDetailInfo: null | string;
  loginId: null | string;
  accountName: string;
  answerChoiceSeq?: number | string;
};

//코드 타입
export type CodeListType = {
  code: string;
  name: string;
  cd: string;
  val: string;
};
