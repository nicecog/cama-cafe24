import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { loginCredentials, logout } from "@/apis/api/auth";
import { setAuthSessionAtom } from "@/atoms/authSessionAtom";
import {
  removeTokenEncryptedStorage,
  setTokenEncryptedStorage,
} from "@/lib/encryptedStorage";
import { queryKeys } from "@/lib/queryClient";
import { createWebFirebaseInfo } from "@/utils/firebaseWeb";

/**
 * ID/PW 로그인 — POST /api/auth (cama-plus-app)
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuthSession = useSetAtom(setAuthSessionAtom);

  return useMutation({
    mutationFn: async ({
      principal,
      credentials,
    }: {
      principal: string;
      credentials: string;
    }) => {
      const firebase = await createWebFirebaseInfo();
      return loginCredentials({ principal, credentials, firebase });
    },
    onSuccess: async (data) => {
      await setTokenEncryptedStorage(data.apiToken);
      setAuthSession({
        loginId: data.account.loginId,
        account: data.account,
      });
      queryClient.setQueryData(
        queryKeys.webview.account.me(data.account.loginId),
        { success: true, error: null, response: data.account },
      );
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const setAuthSession = useSetAtom(setAuthSessionAtom);
  const webviewEntry = "/webview/";

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await removeTokenEncryptedStorage();
      setAuthSession(null);
      queryClient.clear();
      window.location.href = webviewEntry;
    },
  });
};
