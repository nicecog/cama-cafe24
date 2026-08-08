import { useSetAtom } from "jotai";
import { Camera, ImageIcon, Loader2, PencilLine } from "lucide-react";
import {
  mealDraftAtom,
  mealQueuedAtom,
  savedMealAtom,
} from "@/atoms/nutritionAtoms";
import { NutritionDisclaimer } from "@/components/nutrition/NutritionDisclaimer";
import { useMealQueueSync } from "@/hooks/useMealQueueSync";
import {
  describeFoodVisionError,
  useNativeFoodVision,
} from "@/hooks/useNativeFoodVision";
import {
  createDraftFromAnalysis,
  createManualDraft,
} from "@/lib/nutrition/mealDraft";
import type { FoodVisionSource } from "@/lib/webview/nativeBridge.types";

type MealCaptureStepProps = {
  /** 초안이 준비되어 보정 화면으로 넘어갈 때 */
  onDraftReady: () => void;
  onOpenHistory: () => void;
};

/**
 * 촬영 진입 화면. 헤더를 포함하지 않으므로 라우트와 마이페이지 팝업 양쪽에서 쓸 수 있다.
 */
export function MealCaptureStep({
  onDraftReady,
  onOpenHistory,
}: MealCaptureStepProps) {
  const setDraft = useSetAtom(mealDraftAtom);
  const setSavedMeal = useSetAtom(savedMealAtom);
  const setQueued = useSetAtom(mealQueuedAtom);
  const { analyze, analyzing, error, usedMock } = useNativeFoodVision();
  const { pendingCount } = useMealQueueSync();

  const startAnalysis = async (source: FoodVisionSource) => {
    const analysis = await analyze({ source });
    if (!analysis) {
      return;
    }
    // 인식 결과가 없어도 직접 입력으로 이어갈 수 있게 빈 초안을 넘긴다
    const draft = createDraftFromAnalysis(analysis);
    setDraft(
      analysis.items.length === 0 ? { ...draft, sourceCd: "MANUAL" } : draft,
    );
    setSavedMeal(null);
    setQueued(false);
    onDraftReady();
  };

  const startManual = () => {
    setDraft(createManualDraft());
    setSavedMeal(null);
    setQueued(false);
    onDraftReady();
  };

  const errorMessage = describeFoodVisionError(error);

  return (
    <div className="space-y-4 px-4 pb-10 pt-4">
      <section className="rounded-xl bg-white p-4">
        <h1 className="text-lg font-bold text-gray-900">
          음식 사진으로 칼로리 기록
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
          사진은 휴대폰에서만 분석하고 서버로 전송하지 않습니다. 인식된 음식
          목록과 칼로리만 저장됩니다.
        </p>
        <ul className="mt-3 space-y-1 text-xs text-gray-400">
          <li>· 접시 전체가 화면에 들어오도록 위에서 촬영해 주세요.</li>
          <li>· 반찬이 겹치지 않게 펼쳐 두면 인식률이 올라갑니다.</li>
          <li>· 인식 결과는 다음 화면에서 직접 수정할 수 있습니다.</li>
        </ul>
      </section>

      {errorMessage ? (
        <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
          {errorMessage}
        </p>
      ) : null}

      {usedMock ? (
        <p className="rounded-lg bg-blue-50 px-3 py-2.5 text-xs text-blue-600">
          온디바이스 모델이 연결되지 않아 샘플 데이터로 화면을 표시합니다.
        </p>
      ) : null}

      {pendingCount > 0 ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
          전송 대기 중인 식사 기록 {pendingCount}건이 있습니다. 네트워크가
          연결되면 자동으로 저장됩니다.
        </p>
      ) : null}

      <div className="space-y-2">
        <button
          type="button"
          disabled={analyzing}
          onClick={() => void startAnalysis("camera")}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground disabled:opacity-60"
        >
          {analyzing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              분석 중…
            </>
          ) : (
            <>
              <Camera size={18} />
              사진 촬영
            </>
          )}
        </button>

        <button
          type="button"
          disabled={analyzing}
          onClick={() => void startAnalysis("library")}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 disabled:opacity-60"
        >
          <ImageIcon size={16} />
          앨범에서 선택
        </button>

        <button
          type="button"
          disabled={analyzing}
          onClick={startManual}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 disabled:opacity-60"
        >
          <PencilLine size={16} />
          사진 없이 직접 입력
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenHistory}
        className="w-full py-2 text-sm font-medium text-primary underline underline-offset-4"
      >
        지난 식사 기록 보기
      </button>

      <NutritionDisclaimer />
    </div>
  );
}
