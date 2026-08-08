import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MealCaptureStep } from "@/components/nutrition/steps/MealCaptureStep";
import { WebViewBackHeader } from "@/components/webview/WebViewBackHeader";

/** RN: /webview/nutrition/meal/capture */
export const Route = createFileRoute("/webview/nutrition/meal/capture/")({
  component: MealCaptureRoute,
});

function MealCaptureRoute() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-gray-50">
      <WebViewBackHeader title="식사 기록" backTo="/home" />
      <MealCaptureStep
        onDraftReady={() => navigate({ to: "/webview/nutrition/meal/review" })}
        onOpenHistory={() =>
          navigate({ to: "/webview/nutrition/meal/history" })
        }
      />
    </div>
  );
}
