import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getAccountHospital, getAccountMe } from "@/apis/api/webview/account";
import { queryKeys } from "@/lib/queryClient";

/**
 * 내 병원 정보 조회
 * @param seq - 계정 시퀀스 (acSeq)
 * @param enabled - 쿼리 활성화 여부
 */
export const useAccountHospital = (seq: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.webview.account.hospital(seq),
    queryFn: () => getAccountHospital(seq),
    enabled: enabled && !!seq,
    select: (data) => data.response,
  });
};

/**
 * 내 병원 정보 조회 (Suspense)
 * @param seq - 계정 시퀀스 (acSeq)
 */
export const useSuspenseAccountHospital = (seq: string) => {
  return useSuspenseQuery({
    queryKey: queryKeys.webview.account.hospital(seq),
    queryFn: () => getAccountHospital(seq),
    select: (data) => data.response,
  });
};

/**
 * 회원정보 조회
 * @param loginId - 로그인 ID
 * @param enabled - 쿼리 활성화 여부
 */
export const useAccountMe = (loginId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.webview.account.me(loginId),
    queryFn: () => getAccountMe(loginId),
    enabled: enabled && !!loginId,
    select: (data) => data.response,
  });
};

/**
 * 회원정보 조회 (Suspense)
 * @param loginId - 로그인 ID
 * @description Suspense를 사용하므로 data는 절대 undefined가 아닙니다
 */
export const useSuspenseAccountMe = (loginId: string) => {
  return useSuspenseQuery({
    queryKey: queryKeys.webview.account.me(loginId),
    queryFn: () => getAccountMe(loginId),
    select: (data) => data.response,
  });
};
