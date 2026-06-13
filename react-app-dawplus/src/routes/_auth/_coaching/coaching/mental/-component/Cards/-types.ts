import type { ReactNode } from "react";

export interface MentalCardAnswer {
  progressTypeCd: string;
  answerChoice: string;
}

export type MentalCardUserType =
  | "전투형"
  | "순응형"
  | "억압형"
  | "자포자기형"
  | "걱정형";

export interface MentalCardProps {
  onPrev?: () => void;
  onSave: (data: MentalCardAnswer[]) => void;
  title?: ReactNode;
  type: MentalCardUserType;
}
