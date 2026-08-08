import { CloudOff } from "lucide-react";
import { cn } from "@/lib/utils";

type MealTotalsProps = {
  kcal?: number;
  carbG?: number;
  proteinG?: number;
  fatG?: number;
  /** 서버 정본이 아니라 온디바이스 미리보기 값인지 */
  isPreview?: boolean;
  loading?: boolean;
  className?: string;
};

function formatMacro(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) {
    return "-";
  }
  return `${value.toFixed(1)}g`;
}

/** 합계는 서버 estimate 응답(정본)을 우선 표시하고, 실패 시 미리보기로 대체한다 */
export function MealTotals({
  kcal,
  carbG,
  proteinG,
  fatG,
  isPreview = false,
  loading = false,
  className,
}: MealTotalsProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-gray-200 bg-white px-4 py-3",
        className,
      )}
    >
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500">총 섭취 열량</p>
          <p className="mt-0.5 text-2xl font-bold text-gray-900">
            {loading ? (
              <span className="text-base font-medium text-gray-400">
                계산 중…
              </span>
            ) : kcal === undefined ? (
              "-"
            ) : (
              <>
                {Math.round(kcal).toLocaleString()}
                <span className="ml-1 text-sm font-medium text-gray-500">
                  kcal
                </span>
              </>
            )}
          </p>
        </div>

        {isPreview ? (
          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[11px] text-gray-500">
            <CloudOff size={12} />
            오프라인 추정
          </span>
        ) : null}
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-2.5 text-center">
        <div>
          <dt className="text-[11px] text-gray-400">탄수화물</dt>
          <dd className="text-sm font-medium text-gray-700">
            {formatMacro(carbG)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-gray-400">단백질</dt>
          <dd className="text-sm font-medium text-gray-700">
            {formatMacro(proteinG)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-gray-400">지방</dt>
          <dd className="text-sm font-medium text-gray-700">
            {formatMacro(fatG)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
