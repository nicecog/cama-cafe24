import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { MealResultStep } from "@/components/nutrition/steps/MealResultStep";
import { WebViewBackHeader } from "@/components/webview/WebViewBackHeader";

/** RN: /webview/nutrition/meal/result */
export const Route = createFileRoute("/webview/nutrition/meal/result/")({
  component: MealResultRoute,
});

function MealResultRoute() {
  const navigate = useNavigate();

  const goToHistory = useCallback(() => {
    navigate({ to: "/webview/nutrition/meal/history" });
  }, [navigate]);

  const goToCapture = useCallback(() => {
    navigate({ to: "/webview/nutrition/meal/capture" });
  }, [navigate]);

  // useEffect 의존성으로 쓰이므로 참조가 고정돼야 한다
  const replaceWithCapture = useCallback(() => {
    navigate({ to: "/webview/nutrition/meal/capture", replace: true });
  }, [navigate]);

  return (
    <div className="min-h-dvh bg-gray-50">
      <WebViewBackHeader
        title="식사 기록"
        backTo="/webview/nutrition/meal/history"
      />
      <MealResultStep
        onOpenHistory={goToHistory}
        onRestart={goToCapture}
        onMissingResult={replaceWithCapture}
      />
    </div>
  );
}
