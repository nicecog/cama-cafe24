import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  step: number;
  totalSteps: number;
  className?: string;
}

export function StepIndicator({
  step,
  totalSteps,
  className,
}: StepIndicatorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-2",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 text-sm">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < step;
          const isCurrent = stepNumber === step;

          return (
            <div key={stepNumber} className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-black transition-all duration-500 ease-out",
                  isCompleted
                    ? "scale-95 bg-primary border border-white/90 text-white "
                    : isCurrent
                      ? "scale-110 bg-primary text-white shadow-md shadow-primary/30 ring-2 ring-primary/20 ring-offset-1"
                      : "scale-100 bg-slate-100 text-slate-400",
                )}
              >
                {isCompleted ? (
                  <Check
                    size={12}
                    strokeWidth={3}
                    className="animate-in zoom-in duration-300"
                  />
                ) : (
                  <span className={cn(isCurrent && "animate-in  duration-300")}>
                    {stepNumber}
                  </span>
                )}
              </div>

              {stepNumber < totalSteps && (
                <div className="flex items-center justify-center">
                  <ChevronRight
                    size={14}
                    strokeWidth={2.5}
                    className={cn(
                      "transition-colors duration-500 text-slate-200",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
