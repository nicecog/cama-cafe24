import { createFileRoute, redirect } from "@tanstack/react-router";
import { bootstrapWebviewSession } from "@/lib/webview/bootstrapSession";
import { resolveCoachingPathForCategory } from "@/lib/webview/categoryMap";

/** RN: /webview/coaching/{categoryCd}/{loginId} (A~E) */
export const Route = createFileRoute("/webview/coaching/$categoryCd/$loginId/")({
  beforeLoad: async ({ params }) => {
    await bootstrapWebviewSession(params.loginId);
    const to = resolveCoachingPathForCategory(params.categoryCd);
    if (!to) {
      throw redirect({
        to: "/coaching",
        search: { wvLoginId: params.loginId },
      });
    }
    throw redirect({
      to,
      search: { wvLoginId: params.loginId },
    });
  },
});
