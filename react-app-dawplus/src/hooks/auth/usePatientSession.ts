import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { loginCredentials } from "@/apis/api/auth";
import { loginWithBiometric } from "@/apis/api/webview/biometric";
import { forcePasswordChangeAtom } from "@/atoms/CommonAtoms";
import { setAuthSessionAtom } from "@/atoms/authSessionAtom";
import { checkHospitalService } from "@/apis/api/hospital";
import { consumeForcePasswordChange } from "@/lib/forcePasswordChange";
import { queryClient, queryKeys } from "@/lib/queryClient";
import {
  removeTokenEncryptedStorage,
  setTokenEncryptedStorage,
} from "@/lib/encryptedStorage";
import {
  requestNativeClearBiometricSecret,
  requestNativeDeviceId,
} from "@/lib/webview/rnBridge";
import { createWebFirebaseInfo } from "@/utils/firebaseWeb";
import { resolveLoginErrorMessage } from "@/utils/loginErrorMessage";

export type PostLoginRoute = "home" | "selectInfo" | "forcePasswordChange";

export function usePatientSession() {
  const setAuthSession = useSetAtom(setAuthSessionAtom);
  const setForcePasswordChange = useSetAtom(forcePasswordChangeAtom);

  const resolvePostLoginRoute = useCallback(
    async (passwordMustChange?: boolean): Promise<PostLoginRoute> => {
      if (passwordMustChange) {
        setForcePasswordChange(true);
        return "forcePasswordChange";
      }
      try {
        const check = await checkHospitalService();
        if (check.response === "NOT_SERVICE") {
          return "selectInfo";
        }
      } catch {
        // 병원 서비스 확인 실패 시 홈으로 진행
      }
      return "home";
    },
    [setForcePasswordChange],
  );

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

      const forceLocal = consumeForcePasswordChange(resp.account.loginId);
      const mustChange = Boolean(resp.account.passwordMustChange) || forceLocal;
      if (forceLocal && !resp.account.passwordMustChange) {
        setForcePasswordChange(true);
      }

      try {
        sessionStorage.setItem("cama.offerBiometric", "1");
      } catch {
        // ignore
      }

      return resolvePostLoginRoute(mustChange);
    },
    [resolvePostLoginRoute, setAuthSession, setForcePasswordChange],
  );

  const completeBiometricLogin = useCallback(
    async (refreshToken: string): Promise<PostLoginRoute> => {
      const device = await requestNativeDeviceId();
      if (!device.ok || !device.data.deviceId) {
        throw new Error("기기 정보를 확인할 수 없습니다.");
      }
      const firebase = await createWebFirebaseInfo();
      const resp = await loginWithBiometric({
        deviceId: device.data.deviceId,
        refreshToken,
        firebase,
      });
      if (resp.error || !resp.response) {
        throw new Error(resp.error?.message || "생체 로그인에 실패했습니다.");
      }

      const { apiToken, account } = resp.response;
      await setTokenEncryptedStorage(apiToken);
      setAuthSession({
        loginId: account.loginId,
        account,
      });
      queryClient.setQueryData(queryKeys.webview.account.me(account.loginId), {
        success: true,
        error: null,
        response: account,
      });

      return resolvePostLoginRoute(Boolean(account.passwordMustChange));
    },
    [resolvePostLoginRoute, setAuthSession],
  );

  const clearPatientSession = useCallback(async () => {
    await removeTokenEncryptedStorage();
    try {
      await requestNativeClearBiometricSecret();
    } catch {
      // ignore
    }
    setAuthSession(null);
    setForcePasswordChange(false);
    queryClient.clear();
  }, [setAuthSession, setForcePasswordChange]);

  const handleLoginError = useCallback((err: unknown) => {
    return resolveLoginErrorMessage(err);
  }, []);

  return {
    completePatientLogin,
    completeBiometricLogin,
    clearPatientSession,
    handleLoginError,
  };
}
