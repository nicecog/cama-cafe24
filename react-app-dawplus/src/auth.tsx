import { useAtomValue, useSetAtom } from "jotai";
import * as React from "react";
import {
  authSessionAtom,
  readStoredWebviewSession,
  setAuthSessionAtom,
} from "@/atoms/authSessionAtom";
import { isDevAuthBypassEnabled } from "@/lib/devAuth";
import { getTokenEncryptedStorage } from "@/lib/encryptedStorage";
import { isReactNativeWebView } from "@/lib/webview/rnBridge";

export interface AuthContext {
  isAuthenticated: boolean;
  isAuthReady: boolean;
  loginId: string | null;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useAtomValue(authSessionAtom);
  const setAuthSession = useSetAtom(setAuthSessionAtom);
  const [hasToken, setHasToken] = React.useState<boolean | null>(null);

  const syncToken = React.useCallback(async () => {
    const token = await getTokenEncryptedStorage();
    setHasToken(!!token);
    if (token) {
      return;
    }
    // RN WebView: loginId 부트스트랩 세션은 JWT 없이 sessionStorage에 유지
    const stored = readStoredWebviewSession();
    if (stored?.loginId) {
      setAuthSession(stored);
      return;
    }
    setAuthSession(null);
  }, [setAuthSession]);

  React.useEffect(() => {
    syncToken();
  }, [syncToken]);

  React.useEffect(() => {
    if (session?.loginId) {
      syncToken();
    }
  }, [session?.loginId, syncToken]);

  const isAuthReady = hasToken !== null;
  const inNativeWebView = isReactNativeWebView();
  const devAuthBypassEnabled = isDevAuthBypassEnabled();
  const isAuthenticated =
    isAuthReady &&
    !!session?.loginId &&
    (!!hasToken || inNativeWebView || devAuthBypassEnabled);

  const logout = React.useCallback(async () => {
    const { removeTokenEncryptedStorage } = await import(
      "@/lib/encryptedStorage"
    );
    await removeTokenEncryptedStorage();
    setAuthSession(null);
    setHasToken(false);
  }, [setAuthSession]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthReady,
        loginId: session?.loginId ?? null,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("AuthProvider 체크 필요 ");
  }
  return context;
}
