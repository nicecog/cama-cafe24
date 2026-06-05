import { getAccountMe } from "@/apis/api/webview/account";
import {
  authSessionAtom,
  type AuthSession,
  setAuthSessionAtom,
} from "@/atoms/authSessionAtom";
import { getDefaultStore } from "jotai";
import { queryClient, queryKeys } from "@/lib/queryClient";

const store = getDefaultStore();

/**
 * RN WebView: URL의 loginId만으로 세션 부트스트랩 (JWT 없이 webview API 사용)
 */
export async function bootstrapWebviewSession(
  loginId: string,
): Promise<AuthSession> {
  const trimmed = loginId.trim();
  const existing = store.get(authSessionAtom);
  if (
    existing?.loginId === trimmed &&
    existing.account?.loginId &&
    existing.account.seq != null
  ) {
    return existing;
  }

  const res = await getAccountMe(trimmed);
  const account = res.response;
  if (!account?.loginId) {
    throw new Error("계정 정보를 불러오지 못했습니다.");
  }
  const session: AuthSession = { loginId: account.loginId, account };
  store.set(setAuthSessionAtom, session);
  queryClient.setQueryData(
    queryKeys.webview.account.me(account.loginId),
    { success: true, error: null, response: account },
  );
  return session;
}
