import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchWellbeingResourceList } from "@/apis/api/wellbeing";
import { queryKeys } from "@/lib/queryClient";

/**
 * 웰빙 리소스 리스트 무한 스크롤 조회
 * @param wellbeingCategoryCd - 웰빙 카테고리 코드 (필터)
 * @param searchText - 검색어
 * @param enabled - 쿼리 활성화 여부
 */
export const useWellbeingResourceList = (
  wellbeingCategoryCd: string,
  searchText: string,
  enabled = true,
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.webview.wellbeing.resourceList(
      wellbeingCategoryCd,
      searchText,
    ),
    queryFn: ({ pageParam = 1 }) =>
      fetchWellbeingResourceList({
        searchType: "title",
        searchText,
        wellbeingCategoryCd,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // pagination 정보를 활용하여 다음 페이지 판단
      if (!lastPage.pagination) return undefined;

      const { currentPage, totalPage } = lastPage.pagination;

      // 현재 페이지가 마지막 페이지보다 작으면 다음 페이지 반환
      if (currentPage < totalPage) {
        return currentPage + 1;
      }

      return undefined; // 더 이상 페이지 없음
    },
    enabled,
    select: (data) => {
      // 모든 페이지의 데이터를 하나로 합침
      const allItems = data.pages.flatMap((page) => page.response ?? []);
      // 첫 페이지의 pagination 정보 사용
      const pagination = data.pages[0]?.pagination;

      return {
        data: allItems,
        pagination,
        pageParams: data.pageParams,
      };
    },
  });
};
