import { createFileRoute, redirect } from "@tanstack/react-router";
import { bootstrapWebviewSession } from "@/lib/webview/bootstrapSession";

/** RN: /webview/coaching/{loginId} → 코칭 허브 */
export const Route = createFileRoute("/webview/coaching/$loginId/")({
  beforeLoad: async ({ params }) => {
    await bootstrapWebviewSession(params.loginId);
    throw redirect({
      to: "/coaching",
      search: { wvLoginId: params.loginId },
    });
  },
});
