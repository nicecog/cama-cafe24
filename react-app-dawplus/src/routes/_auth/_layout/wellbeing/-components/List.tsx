import { motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import { Building2, Package } from "lucide-react";
import { memo } from "react";
import type { WellbeingResourceItem } from "@/apis/types";
import {
  wellbeingDetailItemAtom,
  wellbeingDetailOpenAtom,
  wellbeingFilterAtom,
  wellbeingSearchTextAtom,
} from "@/atoms/wellbeingAtoms";
import { Each } from "@/components/common/Each";
import { useWellbeingResourceList } from "@/hooks/queries";
import { cn } from "@/lib/utils";

// 카테고리별 색상 매핑
const categoryColors: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    thumbnailBg: string;
  }
> = {
  운동: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    thumbnailBg: "bg-orange-50/50",
  },
  심리: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    thumbnailBg: "bg-cyan-50/50",
  },
  식이: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    thumbnailBg: "bg-green-50/50",
  },
  기타: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    thumbnailBg: "bg-indigo-50/50",
  },
};

// 리스트 아이템 컴포넌트 - 메모이제이션으로 불필요한 리렌더링 방지
const ListItem = memo(
  ({
    item,
    onClick,
  }: {
    item: WellbeingResourceItem;
    onClick: (item: WellbeingResourceItem) => void;
  }) => {
    const categoryColor =
      categoryColors[item.wellbeingCategoryNm] || categoryColors.기타;

    return (
      <div className="group border border-primary rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
        <button type="button" onClick={() => onClick(item)} className="flex">
          {/* 썸네일 영역 - 배경색으로 구분 */}
          <div
            className={cn(
              "flex-shrink-0 relative p-3",
              categoryColor.thumbnailBg,
            )}
          >
            <div className="relative">
              <img
                src={item.thumbnail}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-20 h-20 rounded-lg object-cover bg-gray-100 relative z-10 transition-opacity duration-200"
                style={{ opacity: 1 }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/80?text=No+Image";
                }}
              />

              {/* 카테고리 배지 */}
              <div
                className={cn(
                  "absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-sm z-20",
                  categoryColor.bg,
                  categoryColor.text,
                  categoryColor.border,
                )}
              >
                {item.wellbeingCategoryNm}
              </div>
            </div>
          </div>

          {/* 텍스트 영역 - 흰 배경 */}
          <div className="flex-1 min-w-0 flex flex-col justify-center p-3 bg-white">
            {/* 타이틀 */}
            <h3 className="text-sm font-bold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-primary transition-colors duration-200 text-left">
              {item.title}
            </h3>

            {/* 회사명 */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />
              <span className="font-medium truncate">{item.companyName}</span>
            </div>
          </div>
        </button>
      </div>
    );
  },
);

ListItem.displayName = "ListItem";

export default function List() {
  // Jotai atoms에서 필터와 검색어 읽기
  const selectedFilter = useAtomValue(wellbeingFilterAtom);
  const searchText = useAtomValue(wellbeingSearchTextAtom);

  const setOpen = useSetAtom(wellbeingDetailOpenAtom);
  const setItem = useSetAtom(wellbeingDetailItemAtom);

  // 웰빙 리소스 리스트 조회 (atoms 값이 변경되면 자동으로 재조회)
  const {
    data: resourceData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useWellbeingResourceList(selectedFilter, searchText);

  const onDetailClick = (item: WellbeingResourceItem) => {
    setItem(item);
    setOpen(true);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">자원을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // API 오류 (네트워크/서버 실패 시 빈 목록과 구분)
  if (isError) {
    const message =
      error instanceof Error ? error.message : "자원 목록을 불러오지 못했습니다.";

    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Building2 className="w-10 h-10 text-red-400" />
          </div>
          <p className="text-gray-900 font-semibold mb-1">
            자원을 불러오지 못했습니다
          </p>
          <p className="text-gray-500 text-sm mb-4">{message}</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isFetching ? "다시 불러오는 중..." : "다시 시도"}
          </button>
        </div>
      </div>
    );
  }

  // 빈 상태
  if (!resourceData?.data || resourceData.data.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Building2 className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium mb-1">검색 결과가 없습니다</p>
          <p className="text-gray-400 text-sm">
            다른 검색어나 필터를 시도해보세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 총 건수 표시 - 작은 배지 스타일 */}
      <div className="mb-3 flex justify-end">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10">
          <Package className="w-3.5 h-3.5 text-primary/60" />
          <span className="text-xs text-gray-600">
            총{" "}
            <span className="font-bold text-primary">
              {resourceData.pagination?.totalCount || resourceData.data.length}
            </span>
            건
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Each
          of={resourceData.data}
          render={(item: WellbeingResourceItem) => (
            <ListItem key={item.seq} item={item} onClick={onDetailClick} />
          )}
        />
      </div>
      {/* 무한 스크롤 로딩 버튼 */}
      <div className="pb-20 mt-6">
        {hasNextPage ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            onViewportEnter={() => !isFetchingNextPage && fetchNextPage()}
            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200/50"
          >
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 border-3 border-blue-300/30 rounded-full" />
              <div className="absolute inset-0 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-600 font-medium text-sm">
              웰빙자원을 불러오고 있어요
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium text-sm">
              모든 웰빙 자원을 조회했어요 ✨
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}
