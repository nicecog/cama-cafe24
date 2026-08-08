import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { CheckCircle2, CloudOff } from "lucide-react";
import { useEffect } from "react";
import { MEAL_TYPE_LABELS } from "@/apis/types/nutrition.types";
import {
  mealDraftAtom,
  mealQueuedAtom,
  savedMealAtom,
} from "@/atoms/nutritionAtoms";
import { MealTotals } from "@/components/nutrition/MealTotals";
import { NutritionDisclaimer } from "@/components/nutrition/NutritionDisclaimer";
import { sumPreviewKcal } from "@/lib/nutrition/mealDraft";

type MealResultStepProps = {
  onOpenHistory: () => void;
  onRestart: () => void;
  /** 저장 결과가 없을 때(세션 만료·직접 진입) 촬영 화면으로 되돌리기 */
  onMissingResult: () => void;
};

/** 저장 완료 화면. 두 버튼 모두 흐름 상태를 비운 뒤 다음 화면으로 넘긴다. */
export function MealResultStep({
  onOpenHistory,
  onRestart,
  onMissingResult,
}: MealResultStepProps) {
  const [draft, setDraft] = useAtom(mealDraftAtom);
  const savedMeal = useAtomValue(savedMealAtom);
  const [queued, setQueued] = useAtom(mealQueuedAtom);
  const setSavedMeal = useSetAtom(savedMealAtom);

  const hasResult = Boolean(savedMeal) || queued;

  useEffect(() => {
    if (!hasResult) {
      onMissingResult();
    }
  }, [hasResult, onMissingResult]);

  if (!hasResult) {
    return null;
  }

  const clearFlow = () => {
    setDraft(null);
    setSavedMeal(null);
    setQueued(false);
  };

  const previewKcal = draft ? sumPreviewKcal(draft.items) : undefined;
  const mealTypeCd = savedMeal?.mealTypeCd ?? draft?.mealTypeCd;
  const itemNames = (savedMeal?.items ?? []).map(
    (item) => item.nameKo ?? item.classKey,
  );
  const fallbackNames = (draft?.items ?? []).map(
    (item) => item.nameKo ?? item.classKey,
  );
  const names = itemNames.length > 0 ? itemNames : fallbackNames;

  return (
    <div className="space-y-4 px-4 pb-10 pt-4">
      <section className="rounded-xl bg-white px-4 py-5 text-center">
        {queued ? (
          <>
            <CloudOff size={36} className="mx-auto text-amber-500" />
            <h1 className="mt-2 text-lg font-bold text-gray-900">
              전송 대기 중입니다
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              네트워크가 연결되면 자동으로 저장됩니다. 앱을 종료해도 기록은 남아
              있습니다.
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 size={36} className="mx-auto text-primary" />
            <h1 className="mt-2 text-lg font-bold text-gray-900">
              식사 기록을 저장했습니다
            </h1>
            {mealTypeCd ? (
              <p className="mt-1 text-sm text-gray-500">
                {MEAL_TYPE_LABELS[mealTypeCd]} · {savedMeal?.eatenAt ?? "방금"}
              </p>
            ) : null}
          </>
        )}
      </section>

      <MealTotals
        kcal={savedMeal?.totalKcal ?? previewKcal}
        carbG={savedMeal?.totalCarbG}
        proteinG={savedMeal?.totalProteinG}
        fatG={savedMeal?.totalFatG}
        isPreview={!savedMeal && previewKcal !== undefined}
      />

      {names.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-700">기록된 음식</h2>
          <ul className="mt-2 space-y-1.5">
            {(savedMeal?.items ?? []).map((item) => (
              <li
                key={item.seq ?? item.classKey}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700">
                  {item.nameKo ?? item.classKey}
                </span>
                <span className="text-gray-500">
                  {item.kcal === undefined
                    ? "-"
                    : `${Math.round(item.kcal)} kcal`}
                </span>
              </li>
            ))}
            {savedMeal
              ? null
              : names.map((name) => (
                  <li key={name} className="text-sm text-gray-700">
                    {name}
                  </li>
                ))}
          </ul>
        </section>
      ) : null}

      {savedMeal?.needsReview ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
          인식 정확도가 낮은 항목이 포함되어 "확인 필요"로 저장되었습니다.
          기록에서 수정할 수 있습니다.
        </p>
      ) : null}

      {savedMeal?.guide ? (
        <section className="rounded-xl border border-gray-200 bg-white px-4 py-3">
          {savedMeal.guide.headline ? (
            <h2 className="text-sm font-semibold text-gray-800">
              {savedMeal.guide.headline}
            </h2>
          ) : null}
          {savedMeal.guide.messages?.length ? (
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-gray-600">
              {savedMeal.guide.messages.map((message) => (
                <li key={message}>· {message}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <NutritionDisclaimer text={savedMeal?.guide?.disclaimer} />

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={() => {
            clearFlow();
            onOpenHistory();
          }}
          className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground"
        >
          식사 기록 보기
        </button>
        <button
          type="button"
          onClick={() => {
            clearFlow();
            onRestart();
          }}
          className="h-12 w-full rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700"
        >
          다시 촬영하기
        </button>
      </div>
    </div>
  );
}
