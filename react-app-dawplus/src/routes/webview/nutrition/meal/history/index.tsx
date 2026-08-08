import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MealHistoryStep } from "@/components/nutrition/steps/MealHistoryStep";
import { WebViewBackHeader } from "@/components/webview/WebViewBackHeader";

/** RN: /webview/nutrition/meal/history */
export const Route = createFileRoute("/webview/nutrition/meal/history/")({
  component: MealHistoryRoute,
});

function MealHistoryRoute() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <WebViewBackHeader title="식사 기록" backTo="/home" />
      <MealHistoryStep
        onNewRecord={() => navigate({ to: "/webview/nutrition/meal/capture" })}
      />
    </div>
  );
}
