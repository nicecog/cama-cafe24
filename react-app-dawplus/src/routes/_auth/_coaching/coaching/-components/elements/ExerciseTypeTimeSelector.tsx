import { CheckCircle2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { cn } from "@/lib/utils";

interface ExerciseTypeTimeValue {
  type: string;
  time: string;
}

interface ExerciseTypeTimeSelectorProps {
  value: ExerciseTypeTimeValue;
  onChange: Dispatch<SetStateAction<ExerciseTypeTimeValue>>;
  min?: number;
  max?: number;
}

export function ExerciseTypeTimeSelector({
  value,
  onChange,
  min = 10,
  max = 60,
}: ExerciseTypeTimeSelectorProps) {
  const { pt } = usePageTranslation("coaching/coachingCommon");
  const exerciseTypes = pt("exercise_selector.types", {
    returnObjects: true,
  }) as unknown as string[];
  const timeOptions = [10, 20, 30, 40, 50, 60].filter(
    (time) => time >= min && time <= max,
  );

  return (
    <div className="flex flex-col gap-3">
      <section className="space-y-2">
        <p className="px-0.5 text-sm font-black tracking-tight text-slate-800">
          {pt("exercise_selector.type_label")}
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {exerciseTypes.map((type) => {
            const selected = value.type === type;
            const isLastOdd =
              exerciseTypes.length % 2 === 1 &&
              type === exerciseTypes[exerciseTypes.length - 1];

            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange((prev) => ({ ...prev, type }))}
                className={cn(
                  "rounded-md border bg-white px-3.5 py-3 text-left transition-all duration-200",
                  isLastOdd && "col-span-2",
                  selected
                    ? "border-primary bg-primary/[0.06] text-slate-900"
                    : "border-slate-200 text-slate-700 hover:border-slate-300",
                )}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-slate-300 bg-white text-transparent",
                    )}
                  >
                    <CheckCircle2 size={12} strokeWidth={3} />
                  </div>
                  <span className="min-w-0 whitespace-normal break-keep text-base font-bold leading-snug text-inherit">
                    {type}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <p className="px-0.5 text-sm font-black tracking-tight text-slate-800">
          {pt("exercise_selector.time_label")}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {timeOptions.map((time) => {
            const selected = value.time === String(time);

            return (
              <button
                key={time}
                type="button"
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    time: String(time),
                  }))
                }
                className={cn(
                  "rounded-md border bg-white px-3 py-2.5 text-center text-base font-bold transition-all duration-200",
                  selected
                    ? "border-primary bg-primary/[0.06] text-primary"
                    : "border-slate-200 text-slate-700 hover:border-slate-300",
                )}
              >
                {time}
                {pt("exercise_selector.time_unit")}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
