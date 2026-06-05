import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectableListProps = {
  options: string[];
  value: string | string[];
  multiple?: boolean;
  onChange: (value: string | string[]) => void;
  className?: string;
};

export function SelectableList({
  options,
  value,
  multiple = false,
  onChange,
  className,
}: SelectableListProps) {
  const selectedValues = Array.isArray(value) ? value : [value];

  const toggleValue = (option: string) => {
    if (multiple) {
      const next = selectedValues.includes(option)
        ? selectedValues.filter((item) => item !== option)
        : [...selectedValues, option];
      onChange(next);
      return;
    }

    onChange(option);
  };

  return (
    <div className={cn("grid gap-3", className)}>
      {options.map((option) => {
        const selected = selectedValues.includes(option);

        return (
          <button
            key={option}
            type="button"
            onClick={() => toggleValue(option)}
            className={cn(
              "flex items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left transition-all",
              selected
                ? "border-primary/80 bg-primary text-white shadow-md shadow-primary/20 ring-4 ring-primary/10"
                : "border-slate-100 bg-white text-slate-800 hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm",
            )}
          >
            <span className="text-base font-bold leading-relaxed tracking-tight">
              {option}
            </span>
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/95 text-primary shadow-sm",
                selected ? "opacity-100" : "opacity-0",
              )}
              aria-hidden="true"
            >
              <Check size={16} strokeWidth={4} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
