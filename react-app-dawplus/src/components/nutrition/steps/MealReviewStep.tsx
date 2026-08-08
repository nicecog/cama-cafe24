import { useAtom, useSetAtom } from "jotai";
import { AlertTriangle, Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type FoodClassDto,
  LOW_CONFIDENCE_THRESHOLD,
  MEAL_LIMITS,
  type MealLogDto,
} from "@/apis/types/nutrition.types";
import {
  mealDraftAtom,
  mealQueuedAtom,
  savedMealAtom,
} from "@/atoms/nutritionAtoms";
import { FoodSearchSheet } from "@/components/nutrition/FoodSearchSheet";
import { MealItemCard } from "@/components/nutrition/MealItemCard";
import { MealTotals } from "@/components/nutrition/MealTotals";
import { MealTypePicker } from "@/components/nutrition/MealTypePicker";
import { NutritionDisclaimer } from "@/components/nutrition/NutritionDisclaimer";
import { Input } from "@/components/ui/Input";
import {
  useEstimateMeal,
  useSaveMeal,
} from "@/hooks/mutations/webview/useNutritionMutations";
import {
  clampPortionFactor,
  clampQuantity,
  createDraftItem,
  type MealDraft,
  type MealDraftItem,
  sumPreviewKcal,
  toMealLogRequest,
} from "@/lib/nutrition/mealDraft";

const ESTIMATE_DEBOUNCE_MS = 350;

type SearchTarget = { mode: "add" } | { mode: "replace"; uid: string };

type MealReviewStepProps = {
  onSaved: () => void;
  /** 초안이 없을 때(세션 만료·직접 진입) 촬영 화면으로 되돌리기 */
  onMissingDraft: () => void;
  /**
   * 음식 검색 시트 열림 상태. 팝업 안에서 쓸 때 시트를 닫는 동작이
   * 부모 Popup 까지 닫아 버리는 것을 막는 데 쓴다.
   */
  onNestedDialogOpenChange?: (open: boolean) => void;
};

/**
 * 탐지 목록 확인·보정 화면. 이 기능의 핵심 화면이다.
 *
 * 표시하는 kcal 은 서버 `estimate` 응답(정본)이며, 서버에 닿지 못할 때만
 * 온디바이스 미리보기로 대체한다.
 */
export function MealReviewStep({
  onSaved,
  onMissingDraft,
  onNestedDialogOpenChange,
}: MealReviewStepProps) {
  const [draft, setDraft] = useAtom(mealDraftAtom);
  const setSavedMeal = useSetAtom(savedMealAtom);
  const setQueued = useSetAtom(mealQueuedAtom);

  const estimate = useEstimateMeal();
  const save = useSaveMeal();

  // memo 는 서버 계산에 영향이 없으므로 초안 밖에 두고, 저장 시점에만 합친다.
  // (초안이 바뀔 때마다 estimate 를 재호출하기 때문)
  const [memo, setMemo] = useState("");
  const [serverMeal, setServerMeal] = useState<MealLogDto | null>(null);
  const [estimateFailed, setEstimateFailed] = useState(false);
  const [searchTarget, setSearchTarget] = useState<SearchTarget | null>(null);

  useEffect(() => {
    if (!draft) {
      onMissingDraft();
    }
  }, [draft, onMissingDraft]);

  useEffect(() => {
    onNestedDialogOpenChange?.(searchTarget !== null);
    return () => {
      onNestedDialogOpenChange?.(false);
    };
  }, [searchTarget, onNestedDialogOpenChange]);

  const estimateAsync = estimate.mutateAsync;

  const runEstimate = useCallback(
    async (target: MealDraft) => {
      try {
        const response = await estimateAsync(toMealLogRequest(target));
        setServerMeal(response.response ?? null);
        setEstimateFailed(!response.response);
      } catch {
        // 네트워크·서버 오류 시 온디바이스 미리보기로 화면을 유지한다
        setServerMeal(null);
        setEstimateFailed(true);
      }
    },
    [estimateAsync],
  );

  useEffect(() => {
    if (!draft || draft.items.length === 0) {
      setServerMeal(null);
      setEstimateFailed(false);
      return;
    }
    const timer = window.setTimeout(() => {
      void runEstimate(draft);
    }, ESTIMATE_DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [draft, runEstimate]);

  const updateItems = useCallback(
    (updater: (items: MealDraftItem[]) => MealDraftItem[]) => {
      setDraft((current) =>
        current ? { ...current, items: updater(current.items) } : current,
      );
    },
    [setDraft],
  );

  const handleChangePortion = (uid: string, portionFactor: number) => {
    updateItems((items) =>
      items.map((item) =>
        item.uid === uid
          ? { ...item, portionFactor: clampPortionFactor(portionFactor) }
          : item,
      ),
    );
  };

  const handleChangeQuantity = (uid: string, quantity: number) => {
    updateItems((items) =>
      items.map((item) =>
        item.uid === uid
          ? { ...item, quantity: clampQuantity(quantity) }
          : item,
      ),
    );
  };

  /** 음식을 바꾸면 kcalPreview 는 무효가 되므로 버리고 서버 정본만 쓴다 */
  const applyReplacement = (
    uid: string,
    classKey: string,
    nameKo?: string,
    servingG?: number,
  ) => {
    updateItems((items) =>
      items.map((item) =>
        item.uid === uid
          ? {
              ...item,
              classKey,
              nameKo,
              servingG: servingG ?? item.servingG,
              kcalPreview: undefined,
              isUserCorrected: true,
              originalClassKey: item.originalClassKey ?? item.classKey,
            }
          : item,
      ),
    );
  };

  const handleRemove = (uid: string) => {
    updateItems((items) => items.filter((item) => item.uid !== uid));
  };

  const handleSelectFood = (food: FoodClassDto) => {
    if (!searchTarget) {
      return;
    }
    if (searchTarget.mode === "replace") {
      applyReplacement(
        searchTarget.uid,
        food.classKey,
        food.nameKo,
        food.servingG,
      );
      return;
    }
    updateItems((items) => [
      ...items,
      createDraftItem(food.classKey, food.nameKo, food.servingG),
    ]);
  };

  const handleSave = async () => {
    if (!draft || draft.items.length === 0) {
      return;
    }
    const request = toMealLogRequest({
      ...draft,
      memo: memo.trim() || undefined,
    });
    const outcome = await save.mutateAsync(request);
    if (outcome.status === "saved") {
      setSavedMeal(outcome.meal);
      setQueued(false);
    } else {
      // 서버 정본이 없으므로 마지막 estimate 결과를 그대로 보여준다
      setSavedMeal(serverMeal);
      setQueued(true);
    }
    onSaved();
  };

  /**
   * 서버는 요청 순서를 유지해 응답하므로 인덱스로 대응시킨다.
   * 디바운스 중 초안이 먼저 바뀌어 있을 수 있으니 classKey 로 한 번 더 확인한다.
   */
  const serverItemFor = (item: MealDraftItem, index: number) => {
    const candidate = serverMeal?.items?.[index];
    return candidate?.classKey === item.classKey ? candidate : undefined;
  };

  const lowConfidenceCount = useMemo(
    () =>
      (draft?.items ?? []).filter(
        (item) =>
          !item.isUserCorrected && item.confidence < LOW_CONFIDENCE_THRESHOLD,
      ).length,
    [draft?.items],
  );

  if (!draft) {
    return null;
  }

  const previewKcal = sumPreviewKcal(draft.items);
  const showPreviewTotals = serverMeal === null;
  const canAddMore = draft.items.length < MEAL_LIMITS.maxItems;

  return (
    <>
      <div className="space-y-4 px-4 pt-4">
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-700">
            식사 구분
          </h2>
          <MealTypePicker
            value={draft.mealTypeCd}
            onChange={(mealTypeCd) =>
              setDraft((current) =>
                current ? { ...current, mealTypeCd } : current,
              )
            }
          />
        </section>

        <MealTotals
          kcal={showPreviewTotals ? previewKcal : serverMeal?.totalKcal}
          carbG={serverMeal?.totalCarbG}
          proteinG={serverMeal?.totalProteinG}
          fatG={serverMeal?.totalFatG}
          isPreview={showPreviewTotals && previewKcal !== undefined}
          loading={
            estimate.isPending &&
            serverMeal === null &&
            previewKcal === undefined
          }
        />

        {estimateFailed ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
            서버와 연결되지 않아 휴대폰에서 계산한 값을 표시하고 있습니다. 저장
            시 자동으로 다시 전송합니다.
          </p>
        ) : null}

        {lowConfidenceCount > 0 ? (
          <p className="flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>
              인식 정확도가 낮은 항목이 {lowConfidenceCount}개 있습니다. 그대로
              저장하면 "확인 필요"로 표시됩니다.
            </span>
          </p>
        ) : null}

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">
              음식 목록 ({draft.items.length})
            </h2>
            {canAddMore ? (
              <button
                type="button"
                onClick={() => setSearchTarget({ mode: "add" })}
                className="flex items-center gap-1 text-xs font-medium text-primary"
              >
                <Plus size={14} />
                직접 추가
              </button>
            ) : null}
          </div>

          {draft.items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center">
              <p className="text-sm text-gray-500">
                인식된 음식이 없습니다. 직접 추가해 주세요.
              </p>
              <button
                type="button"
                onClick={() => setSearchTarget({ mode: "add" })}
                className="mt-3 inline-flex h-9 items-center gap-1 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
              >
                <Plus size={14} />
                음식 추가
              </button>
            </div>
          ) : (
            <ul className="space-y-2">
              {draft.items.map((item, index) => (
                <MealItemCard
                  key={item.uid}
                  item={item}
                  serverItem={serverItemFor(item, index)}
                  onChangePortion={handleChangePortion}
                  onChangeQuantity={handleChangeQuantity}
                  onSelectCandidate={(uid, classKey, nameKo) =>
                    applyReplacement(uid, classKey, nameKo)
                  }
                  onReplace={(uid) => setSearchTarget({ mode: "replace", uid })}
                  onRemove={handleRemove}
                />
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-700">
            메모 (선택)
          </h2>
          <Input
            value={memo}
            maxLength={200}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="예: 외식, 간이 도시락"
            className="h-11 bg-white"
          />
        </section>

        <NutritionDisclaimer />
      </div>

      {/*
        fixed 대신 sticky + mt-auto: 라우트에서는 페이지 스크롤, 마이페이지
        팝업에서는 Popup 내부 스크롤 컨테이너 안에 놓이므로 fixed 는 데스크톱
        팝업 폭을 벗어난다. 두 호스트 모두 flex-col 로 감싸 준다.
      */}
      <div className="sticky bottom-0 mt-auto border-t border-gray-200 bg-white px-4 pb-safe pt-3">
        <button
          type="button"
          disabled={draft.items.length === 0 || save.isPending}
          onClick={() => void handleSave()}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground disabled:opacity-50"
        >
          {save.isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              저장 중…
            </>
          ) : (
            "식사 기록 저장"
          )}
        </button>
      </div>

      <FoodSearchSheet
        open={searchTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSearchTarget(null);
          }
        }}
        title={searchTarget?.mode === "replace" ? "음식 변경" : "음식 추가"}
        description={
          searchTarget?.mode === "replace"
            ? "인식 결과를 다른 음식으로 바꿉니다."
            : "인식되지 않은 음식을 직접 추가합니다."
        }
        onSelect={handleSelectFood}
      />
    </>
  );
}
