export interface MentalQuestion {
  id: number;
  text: string;
}

export interface MentalTypeResult {
  type: string;
  dispName: "걱정형" | "자포자기형" | "억압형" | "전투형" | "순응형";
  score: number;
}

export type MentalAnswerValue = number | null;

export type MentalWeekDay =
  | "월요일"
  | "화요일"
  | "수요일"
  | "목요일"
  | "금요일"
  | "토요일"
  | "일요일";

export interface MentalTrainingPlan {
  wday: MentalWeekDay;
  time: string;
}

export interface MentalSchedulePayload {
  loginId: string;
  startDate: string;
  time: string;
  categoryType: "D";
  memo: "심리";
}

export interface MentalTypeMeta {
  title: string;
  keyword: string;
  description: string;
  guide: string;
  techniques: string[];
  resultTitle?: string;
  resultBody: string;
  resultImage: string;
  interpretIntro?: string;
  interpretParagraphs: string[];
  adviceLead: string;
  adviceParagraphs: string[];
  adviceBullets?: string[];
  programIntro: string;
}
