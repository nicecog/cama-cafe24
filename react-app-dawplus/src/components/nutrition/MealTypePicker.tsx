import {
  MEAL_TYPE_LABELS,
  type MealTypeCd,
} from "@/apis/types/nutrition.types";
import { cn } from "@/lib/utils";

const MEAL_TYPES: MealTypeCd[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

type MealTypePickerProps = {
  value: MealTypeCd;
  onChange: (value: MealTypeCd) => void;
  className?: string;
};

export function MealTypePicker({
  value,
  onChange,
  className,
}: MealTypePickerProps) {
  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {MEAL_TYPES.map((type) => (
        <button
          key={type}
          type="button"
          aria-pressed={value === type}
          onClick={() => onChange(type)}
          className={cn(
            "h-10 rounded-lg border text-sm font-medium transition-colors",
            value === type
              ? "border-primary bg-primary text-primary-foreground"
              : "border-gray-200 bg-white text-gray-600",
          )}
        >
          {MEAL_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
