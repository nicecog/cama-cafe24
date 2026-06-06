import { ReactNode } from "react";

export interface AnswersType {
  progressTypeCd: string;
  answerChoice: string;
}

export type CardType = {
  title?: ReactNode;
  type?: string;
  onPrev?: () => void;
  onSave: (data: AnswersType[]) => void;
};

export type StepType = {
  title?: ReactNode;
  onPrev?: () => void;
};

export interface VideoInfo {
  createdAt: string;
  detailDesc: string;
  loginId: string | null;
  priority: number;
  seq: number;
  updatedAt: string;
  url: string;
  useYn: string;
  videoTypeCd: string;
}
