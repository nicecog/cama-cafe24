import { ReactNode } from "react";

export type CardSummaryType = {
  onComplete: () => void;
  children?: ReactNode;
};
