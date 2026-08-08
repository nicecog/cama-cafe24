import { AlertTriangle, Camera, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  MEAL_TYPE_LABELS,
  type MealLogSummaryDto,
} from "@/apis/types/nutrition.types";
import { NutritionDisclaimer } from "@/components/nutrition/NutritionDisclaimer";
import { useDeleteMeal } from "@/hooks/mutations/webview/useNutritionMutations";
import {
  useMealDailySummary,
  useMealList,
} from "@/hooks/queries/webview/useNutritionQueries";
import { useMealQueueSync } from "@/hooks/useMealQueueSync";

const RANGE_DAYS = 30;

function toDateString(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "2026-08-08 12:30:00" → "12:30" */
function toTimeLabel(eatenAt: string | undefined): string {
  if (!eatenAt) {
    return "";
  }
  const time = eatenAt.split(" ")[1];
  return time ? time.slice(0, 5) : "";
}

function toDateKey(eatenAt: string | undefined): string {
  return eatenAt?.split(" ")[0] ?? "";
}

type MealHistoryStepProps = {
  onNewRecord: () => void;
};

/** 최근 30일 식사 기록 목록. */
export function MealHistoryStep({ onNewRecord }: MealHistoryStepProps) {
  const { pendingCount } = useMealQueueSync();
  const deleteMeal = useDeleteMeal();
  const [deletingSeq, setDeletingSeq] = useState<number | null>(null);

  const range = useMemo(() => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(from.getDate() - (RANGE_DAYS - 1));
    return { fromDate: toDateString(from), toDate: toDateString(today) };
  }, []);

  const { data: meals = [], isLoading } = useMealList(range);
  const { data: dailySummary = [] } = useMealDailySummary(range);

  const todayKcal = useMemo(() => {
    const today = toDateString(new Date());
    return dailySummary.find((entry) => entry.mealDate === today)?.totalKcal;
  }, [dailySummary]);

  const grouped = useMemo(() => {
    const map = new Map<string, MealLogSummaryDto[]>();
    for (const meal of meals) {
      const key = toDateKey(meal.eatenAt);
      const bucket = map.get(key);
      if (bucket) {
        bucket.push(meal);
      } else {
        map.set(key, [meal]);
      }
    }
    return Array.from(map.entries());
  }, [meals]);

  const handleDelete = async (seq: number) => {
    setDeletingSeq(seq);
    try {
      await deleteMeal.mutateAsync(seq);
    } finally {
      setDeletingSeq(null);
    }
  };

  return (
    <>
      <div className="space-y-4 px-4 pt-4">
        <section className="rounded-xl border border-gray-200 bg-white px-4 py-3">
          <p className="text-xs text-gray-500">오늘 섭취 열량</p>
          <p className="mt-0.5 text-2xl font-bold text-gray-900">
            {todayKcal === undefined ? (
              "-"
            ) : (
              <>
                {Math.round(todayKcal).toLocaleString()}
                <span className="ml-1 text-sm font-medium text-gray-500">
                  kcal
                </span>
              </>
            )}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            최근 {RANGE_DAYS}일 기록 {meals.length}건
          </p>
        </section>

        {pendingCount > 0 ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
            전송 대기 중인 기록 {pendingCount}건은 목록에 아직 표시되지
            않습니다.
          </p>
        ) : null}

        {isLoading ? (
          <p className="py-10 text-center text-sm text-gray-400">
            불러오는 중…
          </p>
        ) : grouped.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center">
            <p className="text-sm text-gray-500">아직 식사 기록이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map(([dateKey, dayMeals]) => (
              <section key={dateKey}>
                <h2 className="mb-2 text-sm font-semibold text-gray-700">
                  {dateKey}
                </h2>
                <ul className="space-y-2">
                  {dayMeals.map((meal) => (
                    <li
                      key={meal.seq}
                      className="flex items-start justify-between gap-2 rounded-xl border border-gray-200 bg-white p-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-gray-900">
                            {MEAL_TYPE_LABELS[meal.mealTypeCd]}
                          </span>
                          <span className="text-xs text-gray-400">
                            {toTimeLabel(meal.eatenAt)}
                          </span>
                          {meal.needsReview ? (
                            <span className="flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">
                              <AlertTriangle size={10} />
                              확인 필요
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {meal.itemNames ?? "-"}
                          {meal.itemCount && meal.itemCount > 3
                            ? ` 외 ${meal.itemCount - 3}개`
                            : ""}
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {meal.totalKcal === undefined
                            ? "-"
                            : `${Math.round(meal.totalKcal).toLocaleString()} kcal`}
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label="기록 삭제"
                        disabled={deletingSeq === meal.seq}
                        onClick={() => void handleDelete(meal.seq)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 active:bg-gray-100 disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <NutritionDisclaimer />
      </div>

      {/* fixed 대신 sticky + mt-auto (MealReviewStep 주석 참고) */}
      <div className="sticky bottom-0 mt-auto border-t border-gray-200 bg-white px-4 pb-safe pt-3">
        <button
          type="button"
          onClick={onNewRecord}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground"
        >
          <Camera size={18} />새 식사 기록
        </button>
      </div>
    </>
  );
}
