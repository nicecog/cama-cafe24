import { useCallback, useState } from "react";
import { MealCaptureStep } from "@/components/nutrition/steps/MealCaptureStep";
import { MealHistoryStep } from "@/components/nutrition/steps/MealHistoryStep";
import { MealResultStep } from "@/components/nutrition/steps/MealResultStep";
import { MealReviewStep } from "@/components/nutrition/steps/MealReviewStep";

export type MealRecordStep = "capture" | "review" | "result" | "history";

/** Popup 헤더에 표시할 단계별 제목 */
export const MEAL_RECORD_STEP_TITLES: Record<MealRecordStep, string> = {
  capture: "식사기록처리",
  review: "인식 결과 확인",
  result: "저장 완료",
  history: "지난 식사 기록",
};

type MealRecordPageProps = {
  step: MealRecordStep;
  onStepChange: (step: MealRecordStep) => void;
  /** 내부 검색 시트가 열려 있는 동안 부모 Popup 이 닫히지 않게 알린다 */
  onNestedDialogOpenChange?: (open: boolean) => void;
};

/**
 * 내정보 팝업 안에서 식사 기록 흐름(촬영 → 보정 → 결과 / 기록)을 진행한다.
 *
 * 라우트(`/webview/nutrition/meal/*`)와 동일한 단계 컴포넌트를 쓰되,
 * 화면 전환만 라우터 대신 내부 상태로 처리한다. 단계 제목을 Popup 헤더에
 * 반영해야 하므로 현재 단계는 부모가 소유한다.
 */
export function MealRecordPage({
  step,
  onStepChange,
  onNestedDialogOpenChange,
}: MealRecordPageProps) {
  const goToCapture = useCallback(() => {
    onStepChange("capture");
  }, [onStepChange]);

  const goToReview = useCallback(() => {
    onStepChange("review");
  }, [onStepChange]);

  const goToResult = useCallback(() => {
    onStepChange("result");
  }, [onStepChange]);

  const goToHistory = useCallback(() => {
    onStepChange("history");
  }, [onStepChange]);

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      {step === "capture" ? (
        <MealCaptureStep
          onDraftReady={goToReview}
          onOpenHistory={goToHistory}
        />
      ) : null}

      {step === "review" ? (
        <MealReviewStep
          onSaved={goToResult}
          onMissingDraft={goToCapture}
          onNestedDialogOpenChange={onNestedDialogOpenChange}
        />
      ) : null}

      {step === "result" ? (
        <MealResultStep
          onOpenHistory={goToHistory}
          onRestart={goToCapture}
          onMissingResult={goToCapture}
        />
      ) : null}

      {step === "history" ? (
        <MealHistoryStep onNewRecord={goToCapture} />
      ) : null}
    </div>
  );
}

/** 팝업 열림/단계 상태를 함께 관리하는 헬퍼 */
export function useMealRecordFlow() {
  const [step, setStep] = useState<MealRecordStep>("capture");

  const reset = useCallback(() => {
    setStep("capture");
  }, []);

  return { step, setStep, reset, title: MEAL_RECORD_STEP_TITLES[step] };
}
