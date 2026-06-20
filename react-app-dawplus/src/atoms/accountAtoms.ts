import { atomWithQuery } from "jotai-tanstack-query";
import { getAccountHospital, getAccountMe } from "@/apis/api/webview/account";
import type {
  ApiResponse,
  WebviewAccount,
  WebviewHospitalInfo,
} from "@/apis/types";
import { authSessionAtom } from "@/atoms/authSessionAtom";
import i18n from "@/i18n";
import { isValidWebviewAccount } from "@/lib/auth/validateWebviewAccount";
import { queryKeys } from "@/lib/queryClient";

/**
 * 내 계정 정보 — 로그인 세션 loginId 기준 (cama-plus-app account state 와 동일 역할)
 */
export const accountMeAtom = atomWithQuery((get) => {
  const session = get(authSessionAtom);
  const loginId = session?.loginId ?? "";

  return {
    queryKey: queryKeys.webview.account.me(loginId),
    queryFn: async () => {
      const data = await getAccountMe(loginId);
      if (!isValidWebviewAccount(data.response)) {
        throw new Error("Invalid account session");
      }
      return data;
    },
    enabled: !!loginId,
    initialData: session?.account
      ? ({
          success: true,
          error: null,
          response: session.account,
        } as ApiResponse<typeof session.account>)
      : undefined,
    select: (data: ApiResponse<WebviewAccount>) => data.response,
    staleTime: 1000 * 60 * 5,
  };
});

export const accountHospitalAtom = atomWithQuery((get) => {
  const accountMe = get(accountMeAtom);
  const seq = accountMe.data?.seq;
  const currentLang = i18n.language;

  return {
    queryKey: [
      ...queryKeys.webview.account.hospital(seq ? String(seq) : ""),
      currentLang,
    ],
    queryFn: () => getAccountHospital(String(seq)),
    enabled: !!seq,
    select: (data: ApiResponse<WebviewHospitalInfo>) => data.response,
    staleTime: 1000 * 60 * 5,
  };
});
