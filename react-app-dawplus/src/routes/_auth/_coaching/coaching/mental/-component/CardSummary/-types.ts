import type { ReactNode } from "react";

export interface CardSummaryProps {
  children?: ReactNode;
  onComplete: () => void;
}

export interface CardSummaryPopupProps extends CardSummaryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  afterClose?: () => void;
}

export type CardSummaryTitleType = "card1" | "card2" | "card3" | "card4";
