import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { MealReviewStep } from "@/components/nutrition/steps/MealReviewStep";
import { WebViewBackHeader } from "@/components/webview/WebViewBackHeader";

/** RN: /webview/nutrition/meal/review */
export const Route = createFileRoute("/webview/nutrition/meal/review/")({
  component: MealReviewRoute,
});

function MealReviewRoute() {
  const navigate = useNavigate();

  const goToCapture = useCallback(() => {
    navigate({ to: "/webview/nutrition/meal/capture", replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <WebViewBackHeader
        title="인식 결과 확인"
        backTo="/webview/nutrition/meal/capture"
      />
      <MealReviewStep
        onSaved={() => navigate({ to: "/webview/nutrition/meal/result" })}
        onMissingDraft={goToCapture}
      />
    </div>
  );
}
