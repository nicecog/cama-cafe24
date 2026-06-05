import { useAtomValue } from "jotai";
import Lottie from "lottie-react";
import { memo, useMemo, useRef, useState } from "react";
import type { WebviewContentItem } from "@/apis/types";
import NoData from "@/assets/lottie/noData.json";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { FadeInUp } from "@/components/animations";
import { Each } from "@/components/common/Each";
import { Card } from "@/components/ui/Card";
import {
  useContentsList,
  useSearchContentsList,
} from "@/hooks/queries/webview/useContentsQueries";
import { cn } from "@/lib/utils";
import { executedSearchParamsAtom } from "../../-atoms/homeAtom";
import ContentDetail from "../ContentDetai";

// 카드 컴포넌트를 메모이제이션하여 불필요한 리렌더링 방지
const CancerInfoCard = memo(
  ({
    item,
    onClick,
  }: {
    item: { seq: number; image: string; title: string };
    onClick: (id: string) => void;
  }) => {
    return (
      <li>
        <Card
          className="flex gap-4 p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2 border-primary-thin hover:border-primary flex-row items-center"
          onClick={() => onClick(String(item.seq))}
        >
          <div className="flex-none w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex-center">
            <img
              src={item.image}
              alt="암 정보 섬네일"
              className="w-20 h-20 object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
            <h3 className="font-bold text-sm font-jalnan">{item.title}</h3>
          </div>
        </Card>
      </li>
    );
  },
);

CancerInfoCard.displayName = "CancerInfoCard";

export default function CancerInfoList() {
  const executedSearchParams = useAtomValue(executedSearchParamsAtom);

  const { data: accountMe } = useAtomValue(accountMeAtom);

  // 데이터 조회
  const { data: allData } = useContentsList(accountMe?.seq);

  const { data: searchData } = useSearchContentsList(
    accountMe?.seq,
    executedSearchParams.searchText,
    executedSearchParams.diseaseSeq === "99"
      ? ""
      : executedSearchParams.diseaseSeq,
  );

  // 페이지네이션 상태
  const [displayCount, setDisplayCount] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const previousDisplayCountRef = useRef(5); // 이전 표시 개수 추적

  // 데이터 처리 (검색 조건 확인 + 필터링 + 페이지네이션)
  const { displayedData, hasMore, totalCount } = useMemo(() => {
    const hasSearch =
      executedSearchParams.searchText !== "" ||
      executedSearchParams.diseaseSeq !== "99";

    // 검색 조건이 있을 때
    if (hasSearch) {
      // 검색 데이터가 있으면 사용, 없으면 빈 배열 (로딩 중)
      const rawData = searchData?.response
        ? searchData.response.filter((d) => d.viewed)
        : [];

      return {
        displayedData: rawData.slice(0, displayCount),
        hasMore: displayCount < rawData.length,
        totalCount: rawData.length,
      };
    }

    // 검색 조건이 없을 때 (전체 목록)
    const rawData = allData?.response || [];
    return {
      displayedData: rawData.slice(0, displayCount),
      hasMore: displayCount < rawData.length,
      totalCount: rawData.length,
    };
  }, [executedSearchParams, searchData, allData, displayCount]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    previousDisplayCountRef.current = displayCount; // 현재 개수 저장
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
      setIsLoadingMore(false);
    }, 300);
  };

  const [open, setOpen] = useState(false);

  const [selectedData, setSelectedData] = useState<Partial<WebviewContentItem>>(
    {
      seq: 0,
      title: "",
      interest: "",
      contents: "",
      createdAt: "",
      favoriteYn: "N",
      viewed: false,
    },
  );

  const onClick = (id: string) => {
    setOpen(true);
    setSelectedData(allData?.response.find((d) => d.seq === Number(id)) || {});
    // setSelectedId(id);
  };

  return (
    <>
      <ContentDetail
        open={open}
        handleClose={() => setOpen(false)}
        data={selectedData}
      />
      {/* 헤더 */}
      <div className="px-5 flex justify-between items-end mt-8 mb-3">
        <h2 className="text-base font-bold">암정보 리스트</h2>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-600">총</span>
          <span className="text-sm font-bold text-primary">{totalCount}</span>
          <span className="text-xs text-gray-600">건</span>
        </div>
      </div>
      {/* Empty State */}
      {totalCount === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-2.5 px-5 mb-8">
          {/* 리스트 */}
          <ul className="flex flex-col gap-3">
            <Each
              of={displayedData}
              render={(item, index) => {
                // 새로 추가된 아이템인지 확인
                const isNewItem = index >= previousDisplayCountRef.current;
                // 초기 5개 아이템인지 확인 (애니메이션 스킵)
                const isInitialItem = index < 5;

                const cardContent = (
                  <CancerInfoCard item={item} onClick={onClick} />
                );

                // 초기 아이템은 애니메이션 스킵, 새 아이템만 애니메이션 적용
                if (isInitialItem) {
                  return <div key={item.seq}>{cardContent}</div>;
                }

                return isNewItem ? (
                  <FadeInUp
                    key={item.seq}
                    delay={
                      0.05 * ((index - previousDisplayCountRef.current) % 5)
                    }
                  >
                    {cardContent}
                  </FadeInUp>
                ) : (
                  <div key={item.seq}>{cardContent}</div>
                );
              }}
            />
          </ul>

          {/* 더보기 버튼 */}
          {hasMore && (
            <FadeInUp delay={0.1}>
              <div className="mt-4 w-full">
                <button
                  onClick={handleLoadMore}
                  className="w-full flex-center gap-2 px-6 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg"
                >
                  <span
                    className={cn(
                      "text-xl font-bold transition-transform duration-500",
                      isLoadingMore && "animate-spin",
                    )}
                  >
                    +
                  </span>
                  <span>더보기</span>
                </button>
              </div>
            </FadeInUp>
          )}
        </div>
      )}
    </>
  );
}

// Empty State 컴포넌트
function EmptyState() {
  return (
    <FadeInUp delay={0.1}>
      <div className="flex flex-col items-center justify-center py-16 px-5 ">
        <div className="w-32 h-32 mb-6">
          <Lottie animationData={NoData} loop={true} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-sm text-gray-600 text-center leading-relaxed mb-6">
          다른 검색어나 암 종류를 선택해보세요
        </p>
        <div className="w-full max-w-sm bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">💡 검색 팁</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 검색어를 더 간단하게 입력해보세요</li>
            <li>• 암 종류를 "전체"로 변경해보세요</li>
            <li>• 초기화 버튼을 눌러 전체 목록을 확인하세요</li>
          </ul>
        </div>
      </div>
    </FadeInUp>
  );
}
