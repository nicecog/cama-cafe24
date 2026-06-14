import { cn } from "@/lib/utils";
import type { CancerTypeName } from "../-constants/exerciseCodeMap";

const cancers: CancerTypeName[] = ["대장암", "폐암", "유방암", "갑상선암"];

interface ExerciseCancerSelectorProps {
  selectedCancer: string;
  onSelect: (cancer: CancerTypeName) => void;
}

export function ExerciseCancerSelector({
  selectedCancer,
  onSelect,
}: ExerciseCancerSelectorProps) {
  return (
    <section className="grid grid-cols-2 gap-3">
      {cancers.map((cancer) => {
        const isSelected = selectedCancer === cancer;

        return (
          <button
            key={cancer}
            type="button"
            onClick={() => onSelect(cancer)}
            className={cn(
              "rounded-xl border px-4 py-5 transition text-center",
              isSelected
                ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
                : "border-slate-200 bg-white text-slate-800 hover:border-primary/40",
            )}
          >
            <span className="text-base font-extrabold ">{cancer}</span>
          </button>
        );
      })}
    </section>
  );
}
