import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { readStoredWebviewSession } from "@/atoms/authSessionAtom";
import { LoginLanding } from "@/components/auth/LoginLanding";
import { isDevAuthBypassEnabled } from "@/lib/devAuth";
import { isReactNativeWebView } from "@/lib/webview/rnBridge";

export const Route = createFileRoute("/login/")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: async ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: search.redirect || import.meta.env.VITE_DEFAULT_PAGE,
      });
    }
    if (isReactNativeWebView()) {
      const stored = readStoredWebviewSession();
      if (stored?.loginId) {
        const target = search.redirect?.trim();
        if (target) {
          throw redirect({ href: target });
        }
        throw redirect({
          to: "/coaching",
          search: { wvLoginId: stored.loginId },
        });
      }
    }
    if (isDevAuthBypassEnabled()) {
      return;
    }
  },
  component: LoginComponent,
});

export function LoginComponent() {
  const search = Route.useSearch();
  return <LoginLanding redirect={search.redirect} />;
}
