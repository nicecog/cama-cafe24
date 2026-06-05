import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useCareTrackContent } from "@/hooks/queries";
import { useSearchContentsList } from "@/hooks/queries/webview/useContentsQueries";
import {
  executedSearchParamsAtom,
  selectedDayAtom,
} from "../../-atoms/homeAtom";
import SearchResultList from "./SearchResultList";
import TrackServiceList from "./TrackServiceList";

/**
 * 암정보 리스트 메인 컴포넌트
 * - 검색 상태에 따라 TrackServiceList 또는 SearchResultList를 렌더링
 */
export default function ConfiguredCancerInfoList() {
  const executedSearchParams = useAtomValue(executedSearchParamsAtom);
  const { data: accountMe } = useAtomValue(accountMeAtom);

  // 선택된 일차 (DailyCarousel에서 선택)
  const selectedDay = useAtomValue(selectedDayAtom);

  // 검색 여부 확인
  const hasSearch =
    executedSearchParams.searchText !== "" ||
    executedSearchParams.diseaseSeq !== "99";

  // 여정 컨텐츠 리스트 (선택된 일차 또는 현재 일차)
  const { trackServiceList, appliedInfo } = useCareTrackContent(selectedDay);

  // 검색 파라미터 준비
  const searchParams = useMemo(() => {
    if (!hasSearch)
      return { acSeq: undefined, searchText: undefined, diseaseSeq: undefined };

    return {
      acSeq: accountMe?.seq,
      searchText: executedSearchParams.searchText,
      diseaseSeq:
        executedSearchParams.diseaseSeq !== "99"
          ? executedSearchParams.diseaseSeq
          : undefined,
    };
  }, [
    hasSearch,
    accountMe?.seq,
    executedSearchParams.searchText,
    executedSearchParams.diseaseSeq,
  ]);

  // 검색 데이터 (검색 조건이 있을 때만 호출)
  const { data: searchData } = useSearchContentsList(
    searchParams.acSeq,
    searchParams.searchText,
    searchParams.diseaseSeq,
  );

  // 검색 결과를 표시할지 여부
  const isShowingSearchResults = useMemo(() => {
    return hasSearch && searchData?.response !== undefined;
  }, [hasSearch, searchData]);

  // 검색 상태에 따라 적절한 컴포넌트 렌더링
  if (isShowingSearchResults) {
    return <SearchResultList searchData={searchData?.response || null} />;
  }

  return (
    <TrackServiceList
      trackServiceList={trackServiceList ?? null}
      appliedInfoSeq={appliedInfo?.seq}
    />
  );
}
