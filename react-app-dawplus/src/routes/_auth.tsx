import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { z } from "zod";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { readStoredWebviewSession } from "@/atoms/authSessionAtom";
import { useForegroundHealthSync } from "@/hooks/useForegroundHealthSync";
import { getDevAuthBypassLoginId, isDevAuthBypassEnabled } from "@/lib/devAuth";
import { getTokenEncryptedStorage } from "@/lib/encryptedStorage";
import { bootstrapWebviewSession } from "@/lib/webview/bootstrapSession";

const authSearchSchema = z.object({
  wvLoginId: z.string().optional(),
});

export const Route = createFileRoute("/_auth")({
  validateSearch: authSearchSchema,
  beforeLoad: async ({ search, location }) => {
    if (search.wvLoginId?.trim()) {
      await bootstrapWebviewSession(search.wvLoginId.trim());
      return;
    }
    const devBypassLoginId = getDevAuthBypassLoginId();
    if (devBypassLoginId) {
      await bootstrapWebviewSession(devBypassLoginId);
      return;
    }
    const token = await getTokenEncryptedStorage();
    if (token) {
      return;
    }
    const stored = readStoredWebviewSession();
    if (stored?.loginId) {
      return;
    }
    if (isDevAuthBypassEnabled()) {
      return;
    }
    throw redirect({
      to: import.meta.env.VITE_LOGIN_PAGE as string,
      search: {
        redirect: location.href,
      },
    });
  },
  component: AuthLayout,
});

function AuthLayout() {
  const accountMe = useAtomValue(accountMeAtom);
  useForegroundHealthSync(accountMe.data?.seq);

  return <Outlet />;
}
