import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import {
  changeAccountPassword,
  getAccountMe,
  updateAccountProfile,
  withdrawAccount,
} from "@/apis/api/webview";
import type {
  PatientChangePasswordRequest,
  PatientProfileUpdateRequest,
} from "@/apis/types";
import { authSessionAtom, setAuthSessionAtom } from "@/atoms/authSessionAtom";
import { queryKeys } from "@/lib/queryClient";

/**
 * 회원 탈퇴 Mutation (Webview)
 */
export const useWithdrawAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loginId: string) => withdrawAccount(loginId),
    onSuccess: (_, loginId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.webview.account.me(loginId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser(),
      });
    },
  });
};

/**
 * 회원 상세정보 수정 Mutation (Webview)
 */
export const useUpdateAccountProfile = () => {
  const queryClient = useQueryClient();
  const session = useAtomValue(authSessionAtom);
  const setSession = useSetAtom(setAuthSessionAtom);

  return useMutation({
    mutationFn: async (dto: PatientProfileUpdateRequest) => {
      const data = await updateAccountProfile(dto);
      if (data.error) {
        throw new Error(data.error.message || "수정에 실패했습니다.");
      }
      if (data.success === false || data.response == null) {
        throw new Error("수정에 실패했습니다.");
      }
      return data.response;
    },
    onSuccess: async (_, dto) => {
      const refreshed = await getAccountMe(dto.loginId);
      if (refreshed.response) {
        queryClient.setQueryData(
          queryKeys.webview.account.me(dto.loginId),
          refreshed,
        );
        if (session?.loginId === dto.loginId) {
          setSession({
            loginId: dto.loginId,
            account: refreshed.response,
          });
        }
      }
      await queryClient.invalidateQueries({
        queryKey: queryKeys.webview.account.me(dto.loginId),
      });
    },
  });
};

/**
 * 회원 비밀번호 변경 Mutation (Webview)
 */
export const useChangeAccountPassword = () => {
  return useMutation({
    mutationFn: async (dto: PatientChangePasswordRequest) => {
      const data = await changeAccountPassword(dto);
      if (data.error) {
        throw new Error(data.error.message || "비밀번호 변경에 실패했습니다.");
      }
      if (data.success === false || data.response == null) {
        throw new Error("비밀번호 변경에 실패했습니다.");
      }
      return data.response;
    },
  });
};
