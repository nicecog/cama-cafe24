import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { saveFavorite } from "@/apis/api/webview/contents";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { queryKeys } from "@/lib/queryClient";

/**
 * 즐겨찾기 저장 (추가/삭제) Mutation
 */
export const useSaveFavorite = () => {
  const queryClient = useQueryClient();
  const { data: accountInfo } = useAtomValue(accountMeAtom);
  const acSeq = accountInfo?.seq?.toString() || "";

  return useMutation({
    mutationFn: ({
      type,
      contentsSeq,
    }: {
      type: "C" | "D";
      contentsSeq: number;
    }) => {
      if (!accountInfo?.seq) {
        throw new Error("Account information is not available");
      }
      return saveFavorite(accountInfo.seq, type, contentsSeq);
    },
    onSuccess: () => {
      // 즐겨찾기 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.webview.contents.favoriteList(acSeq),
      });
      // 컨텐츠 목록도 무효화 (즐겨찾기 상태 반영)
      queryClient.invalidateQueries({
        queryKey: queryKeys.webview.contents.list(acSeq),
      });
    },
  });
};
