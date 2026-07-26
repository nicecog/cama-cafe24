import type { ReactNode } from "react";
import { MentalCardBubble } from "../-component/Cards/-components";

export default function Bubble({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  type?: string;
}) {
  return (
    <div className={className}>
      <MentalCardBubble tone="summary">{children}</MentalCardBubble>
    </div>
  );
}
