import { useQuery } from "@tanstack/react-query";
import {
  fetchContentsList,
  getContentDetail,
  getFavoriteList,
  searchContentsList,
} from "@/apis/api/webview/contents";
import { queryKeys } from "@/lib/queryClient";

/**
 * 치료정보 리스트 조회
 * @param acSeq - 계정 시퀀스
 * @param enabled - 쿼리 활성화 여부
 */
export const useContentsList = (acSeq?: string | number) => {
  return useQuery({
    queryKey: queryKeys.webview.contents.list(String(acSeq)),
    queryFn: () => fetchContentsList(String(acSeq)),
    enabled: !!acSeq,
  });
};

/**
 * 치료정보 검색
 * @param acSeq - 계정 시퀀스
 * @param searchText - 검색어 (선택사항)
 * @param diseaseSeq - 질병 시퀀스 (선택사항)
 * @param enabled - 쿼리 활성화 여부
 */
export const useSearchContentsList = (
  acSeq?: string | number,
  searchText?: string,
  diseaseSeq?: string,
) => {
  // 검색 조건이 있을 때만 실행
  const hasSearchCondition =
    searchText !== "" || (diseaseSeq !== "" && diseaseSeq !== undefined);

  return useQuery({
    queryKey: queryKeys.webview.contents.search(acSeq, searchText, diseaseSeq),
    queryFn: () => searchContentsList(acSeq, searchText, diseaseSeq),
    enabled: !!acSeq && hasSearchCondition,
  });
};

/**
 * 즐겨찾기 목록 조회
 * @param acSeq - 계정 seq
 */
export const useFavoriteList = (acSeq?: string | number) => {
  return useQuery({
    queryKey: queryKeys.webview.contents.favoriteList(String(acSeq)),
    queryFn: () => getFavoriteList(String(acSeq)),
    select: (data) => data.response || [],
    enabled: !!acSeq,
  });
};

/**
 * Contents 상세 조회
 * @param seq - 컨텐츠 seq
 */
export const useGetContentDetail = (seq: string) => {
  return useQuery({
    queryKey: queryKeys.webview.contents.detail(seq),
    queryFn: () => getContentDetail(seq),
    select: (data) => data.response,
    enabled: !!seq,
  });
};
