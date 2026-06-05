import { useAtomValue } from "jotai";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { getTokenEncryptedStorage } from "@/lib/encryptedStorage";
import { useQuery } from "@tanstack/react-query";

/**
 * JWT 존재 여부 + accountMe atom 기반 인증 상태
 */
export const useAuthStatus = () => {
  const accountQuery = useAtomValue(accountMeAtom);
  const tokenQuery = useQuery({
    queryKey: ["auth", "hasToken"],
    queryFn: async () => !!(await getTokenEncryptedStorage()),
  });

  return {
    account: accountQuery.data,
    isAuthenticated:
      !!tokenQuery.data && !!accountQuery.data?.loginId,
    isLoading: accountQuery.isPending || tokenQuery.isPending,
    error: accountQuery.error ?? tokenQuery.error,
  };
};
