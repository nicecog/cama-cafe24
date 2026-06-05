import Lottie from "lottie-react";
import { memo, useMemo, useState } from "react";
import type { WebviewContentItem } from "@/apis/types";
import NoData from "@/assets/lottie/noData.json";
import { FadeInUp } from "@/components/animations";
import { Each } from "@/components/common/Each";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import ContentDetail from "../ContentDetai";

// 카드 컴포넌트
const CancerInfoCard = memo(
  ({
    item,
    onClick,
  }: {
    item: { seq: number; image: string; title: string };
    onClick: (id: string) => void;
  }) => (
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
  ),
);

CancerInfoCard.displayName = "CancerInfoCard";

interface SearchResultListProps {
  searchData: WebviewContentItem[] | null;
}

/**
 * 검색 결과 리스트 컴포넌트
 * - 검색했을 때 표시되는 컴포넌트
 * - 페이징 기능 포함 (5개씩 더보기)
 */
export default function SearchResultList({
  searchData,
}: SearchResultListProps) {
  // 페이지네이션
  const [displayCount, setDisplayCount] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 상세보기
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Partial<WebviewContentItem>>(
    {},
  );

  const onClick = (id: string) => {
    setOpen(true);
    setSelectedData(searchData?.find((d) => d.seq === Number(id)) || {});
  };

  // 표시할 데이터 계산
  const { displayedData, hasMore, totalCount } = useMemo(() => {
    const rawData = searchData?.filter((d) => d.viewed) || [];
    return {
      displayedData: rawData.slice(0, displayCount),
      hasMore: displayCount < rawData.length,
      totalCount: rawData.length,
    };
  }, [searchData, displayCount]);

  // 더보기
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
      setIsLoadingMore(false);
    }, 300);
  };

  return (
    <>
      <ContentDetail
        open={open}
        handleClose={() => setOpen(false)}
        data={selectedData}
        seq={undefined}
        shouldUpdateProgress={false}
      />

      {/* 헤더 */}
      <div className="px-5 flex justify-between items-end mt-8">
        <h2 className="text-base font-bold">검색 결과</h2>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-600">총</span>
          <span className="text-sm font-bold text-primary">
            {totalCount} 건
          </span>
        </div>
      </div>

      {/* 리스트 */}
      {totalCount === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-2.5 px-5 mb-8">
          <ul className="flex flex-col gap-3">
            <Each
              of={displayedData}
              render={(item) => (
                <CancerInfoCard key={item.seq} item={item} onClick={onClick} />
              )}
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

// Empty State
function EmptyState() {
  return (
    <FadeInUp delay={0.1}>
      <div className="flex flex-col items-center justify-center py-16 px-5">
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
