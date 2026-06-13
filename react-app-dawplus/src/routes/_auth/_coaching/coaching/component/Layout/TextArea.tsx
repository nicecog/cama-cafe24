import type { ReactNode } from "react";
import Textbox from "../../-components/elements/Textbox";
import { cn } from "@/lib/utils";

export default function TextArea({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <Textbox className={cn("text-left text-base", className)}>{children}</Textbox>;
}
