import type { ReactNode } from "react";
import Textbox from "../../-components/elements/Textbox";
import { cn } from "@/lib/utils";

export default function TextBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="rounded-[30px] border border-slate-100 bg-white px-5 py-6 shadow-sm">
      <Textbox className={cn("text-left text-base", className)}>{children}</Textbox>
    </div>
  );
}
