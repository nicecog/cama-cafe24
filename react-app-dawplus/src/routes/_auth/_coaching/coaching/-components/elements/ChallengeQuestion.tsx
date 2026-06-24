import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChallengeQuestionOption =
  | string
  | {
      label: ReactNode;
      value: string;
    };

export default function ChallengeQuestion(props: {
  title: string;
  options: ChallengeQuestionOption[];
  value: string | string[];
  onChange: (value: string) => void;
  className?: string;
  multiple?: boolean;
  centeredOptions?: boolean;
}) {
  const {
    title,
    options,
    value,
    onChange,
    className,
    multiple,
    centeredOptions = false,
  } = props;
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  );
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <>
      <div className={cn("relative mb-5 w-full text-center", className)}>
        <h2 className="text-balance whitespace-pre-wrap text-xl font-bold leading-6 tracking-tight text-slate-900 sm:text-2xl break-keep  ">
          {title}
        </h2>
      </div>

      <div className="flex flex-col w-full gap-3">
        {normalizedOptions.map((option) => {
          const isSelected = multiple
            ? selectedValues.includes(option.value)
            : value === option.value;

          return (
              <motion.button
                key={option.value}
                type="button"
                data-testid={`coaching-option-${option.value}`}
                onClick={() => onChange(option.value)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.975 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border px-4 py-4 transition-all",
                centeredOptions ? "text-center" : "text-left",
                isSelected
                  ? "border-primary/80 bg-gradient-to-br from-primary to-primary/90 text-white shadow-lg shadow-primary/20 ring-4 ring-primary/10"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm",
              )}
            >
              <div
                className={cn(
                  "relative z-10 gap-3",
                  centeredOptions
                    ? "flex flex-col items-center justify-center"
                    : "flex items-center justify-between",
                )}
              >
                <span
                  className={cn(
                    "text-base font-black  break-keep leading-relaxed",
                    isSelected
                      ? "text-white"
                      : "text-slate-800 group-hover:text-primary",
                  )}
                >
                  {option.label}
                </span>
                <motion.span
                  initial={false}
                  animate={{
                    scale: isSelected ? 1 : 0.85,
                    opacity: isSelected ? 1 : 0,
                    y: isSelected ? 0 : 2,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 26,
                  }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/95 text-primary shadow-sm"
                  aria-hidden="true"
                >
                  ✓
                </motion.span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
