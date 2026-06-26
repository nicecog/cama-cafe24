import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { readStoredWebviewSession } from "@/atoms/authSessionAtom";
import { LoginLanding } from "@/components/auth/LoginLanding";
import { getDevAuthBypassLoginId, isDevAuthBypassEnabled } from "@/lib/devAuth";
import { getTokenEncryptedStorage } from "@/lib/encryptedStorage";

export const Route = createFileRoute("/webview/")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: async ({ search }) => {
    const token = await getTokenEncryptedStorage();
    const stored = readStoredWebviewSession();

    if (token || stored?.loginId || getDevAuthBypassLoginId()) {
      if (search.redirect?.trim()) {
        throw redirect({ href: search.redirect.trim() });
      }
      throw redirect({ to: "/" });
    }

    if (isDevAuthBypassEnabled()) {
      throw redirect({ to: "/" });
    }
  },
  component: WebviewEntryComponent,
});

function WebviewEntryComponent() {
  const search = Route.useSearch();

  return <LoginLanding redirect={search.redirect} />;
}
