import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawAccount } from "@/apis/api/webview";
import { queryKeys } from "@/lib/queryClient";

/**
 * 회원 탈퇴 Mutation (Webview)
 */
export const useWithdrawAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loginId: string) => withdrawAccount(loginId),
    onSuccess: (_, loginId) => {
      // 회원 정보 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.webview.account.me(loginId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser(),
      });
    },
  });
};
