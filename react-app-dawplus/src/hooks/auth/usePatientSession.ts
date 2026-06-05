import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { loginCredentials } from "@/apis/api/auth";
import { setAuthSessionAtom } from "@/atoms/authSessionAtom";
import { checkHospitalService } from "@/apis/api/hospital";
import { queryClient, queryKeys } from "@/lib/queryClient";
import {
  removeTokenEncryptedStorage,
  setTokenEncryptedStorage,
} from "@/lib/encryptedStorage";
import { createWebFirebaseInfo } from "@/utils/firebaseWeb";
import { resolveLoginErrorMessage } from "@/utils/loginErrorMessage";

export type PostLoginRoute = "home" | "selectInfo";

export function usePatientSession() {
  const setAuthSession = useSetAtom(setAuthSessionAtom);

  const completePatientLogin = useCallback(
    async (loginId: string, password: string): Promise<PostLoginRoute> => {
      const firebase = await createWebFirebaseInfo();
      const resp = await loginCredentials({
        principal: loginId.trim(),
        credentials: password,
        firebase,
      });

      await setTokenEncryptedStorage(resp.apiToken);
      setAuthSession({
        loginId: resp.account.loginId,
        account: resp.account,
      });

      queryClient.setQueryData(
        queryKeys.webview.account.me(resp.account.loginId),
        { success: true, error: null, response: resp.account },
      );

      let route: PostLoginRoute = "home";
      try {
        const check = await checkHospitalService();
        if (check.response === "NOT_SERVICE") {
          route = "selectInfo";
        }
      } catch {
        // 병원 서비스 확인 실패 시 홈으로 진행
      }

      return route;
    },
    [setAuthSession],
  );

  const clearPatientSession = useCallback(async () => {
    await removeTokenEncryptedStorage();
    setAuthSession(null);
    queryClient.clear();
  }, [setAuthSession]);

  const handleLoginError = useCallback((err: unknown) => {
    return resolveLoginErrorMessage(err);
  }, []);

  return { completePatientLogin, clearPatientSession, handleLoginError };
}
