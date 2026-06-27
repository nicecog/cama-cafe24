import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ExerciseShellProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function ExerciseShell({
  title,
  description,
  children,
  footer,
  className,
}: ExerciseShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-primary-thin/10">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pb-10 pt-6">
        <header className="mb-5 rounded-md border border-primary/15 bg-white px-6 py-5 shadow-sm">
          <h1 className="font-jalnan text-3xl text-slate-900">{title}</h1>
          {description ? (
            <div className="mt-3 text-sm font-medium leading-6 text-slate-500">
              {description}
            </div>
          ) : null}
        </header>

        <main className={cn("relative z-0 flex flex-1 flex-col gap-4", className)}>
          {children}
        </main>
      </div>

      {footer ? (
        <div className="sticky bottom-0 z-20 isolate border-t border-slate-100 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3">
          <div className="mx-auto w-full max-w-3xl">{footer}</div>
        </div>
      ) : null}
    </div>
  );
}
