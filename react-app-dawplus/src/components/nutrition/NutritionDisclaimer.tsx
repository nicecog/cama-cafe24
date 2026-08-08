import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_TEXT =
  "사진으로 계산한 추정값이며 참고용입니다. 진단·처방의 근거로 사용할 수 없습니다.";

type NutritionDisclaimerProps = {
  text?: string;
  className?: string;
};

/** 의료기기 오인 방지 고지. 칼로리 수치를 보여주는 모든 화면에 상시 노출한다 */
export function NutritionDisclaimer({
  text,
  className,
}: NutritionDisclaimerProps) {
  return (
    <p
      className={cn(
        "flex items-start gap-1.5 rounded-md bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-500",
        className,
      )}
    >
      <Info size={14} className="mt-0.5 shrink-0" />
      <span>{text ?? DEFAULT_TEXT}</span>
    </p>
  );
}
