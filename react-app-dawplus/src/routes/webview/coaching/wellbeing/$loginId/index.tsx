import { createFileRoute, redirect } from "@tanstack/react-router";
import { bootstrapWebviewSession } from "@/lib/webview/bootstrapSession";

/** RN: /webview/coaching/wellbeing/{loginId} */
export const Route = createFileRoute("/webview/coaching/wellbeing/$loginId/")({
  beforeLoad: async ({ params }) => {
    await bootstrapWebviewSession(params.loginId);
    throw redirect({
      to: "/wellbeing",
      search: { wvLoginId: params.loginId },
    });
  },
});
