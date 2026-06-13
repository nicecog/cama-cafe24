import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function ImporText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("mx-1 font-extrabold text-primary", className)}>{children}</span>
  );
}
