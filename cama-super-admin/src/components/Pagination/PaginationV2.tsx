import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipPrevious, BiSkipNext } from "react-icons/bi";
import { FaRegListAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

type PaginationProps = {
  pagination: {
    startNum: number;
    endNum: number;
    totalCount: number;
    currentPage: number;
    totalPage: number;
    displayPage: number;
    displayRow: number;
    beginPage: number;
    endPage: number;
    prevPage: number;
    nextPage: number;
  };
  onPageChange: (page: number) => void;
};

export default function PaginationV2({ pagination, onPageChange }: PaginationProps) {
  const { t } = useTranslation();

  const {
    startNum,
    endNum,
    totalCount,
    currentPage,
    totalPage,
    beginPage,
    endPage,
    prevPage,
    nextPage,
  } = pagination;

  // 이전 페이지 그룹으로 이동 가능 여부
  const hasPrevGroup = currentPage > 1;
  
  // 다음 페이지 그룹으로 이동 가능 여부
  const hasNextGroup = currentPage < totalPage;

  // 페이지 번호 배열 생성 (최대 5개로 제한)
  const MAX_DISPLAY_PAGES = 5;
  const pageCount = Math.min(endPage - beginPage + 1, MAX_DISPLAY_PAGES);
  const pageNumbers = Array.from(
    { length: pageCount },
    (_, i) => beginPage + i
  );

  // 생략 표시 여부
  const showStartEllipsis = beginPage > 1;
  const showEndEllipsis = endPage < totalPage;

  return (
    <div className="p-2 mt-2 flex items-center justify-between bg-main text-white rounded-lg border">
      {/* 왼쪽: 현재 표시 범위 */}
      <div className="flex text-sm gap-3 items-center">
        <FaRegListAlt className="text-[18px] -mr-1" />
        <span>
          {t("pagination.itemPrefix")}
          {startNum + 1}
          {t("pagination.itemRange")}
          {Math.min(endNum, totalCount)}
          {t("pagination.itemSuffix")} {t("pagination.totalCount", { count: totalCount })}
        </span>
      </div>

      {/* 오른쪽: 페이지 네비게이션 */}
      <div className="flex gap-2 items-center">
        {/* 첫 페이지 */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevGroup}
          className={`py-1.5 px-3 text-sm text-white border rounded-lg shadow-md transition-all duration-200 ease-in-out flex items-center gap-1 ${
            hasPrevGroup
              ? "bg-[#619e83] border-[#619e83] hover:bg-[#267b49] hover:scale-x-105"
              : "bg-gray-400 border-gray-400 cursor-not-allowed opacity-50"
          }`}
        >
          <BiSkipPrevious className="text-md" />
          {t("pagination.first")}
        </button>

        {/* 이전 페이지 */}
        <button
          onClick={() => onPageChange(prevPage)}
          disabled={!hasPrevGroup}
          className={`py-1.5 px-3 text-sm text-white border rounded-lg shadow-md transition-all duration-200 ease-in-out flex items-center gap-1 ${
            hasPrevGroup
              ? "bg-[#619e83] border-[#619e83] hover:bg-[#267b49] hover:scale-x-105"
              : "bg-gray-400 border-gray-400 cursor-not-allowed opacity-50"
          }`}
        >
          <GrFormPrevious className="text-md" />
          {t("pagination.previous")}
        </button>

        {/* 페이지 번호들 */}
        <div className="flex gap-1 items-center">
          {/* 시작 생략 표시 */}
          {showStartEllipsis && (
            <span className="px-2 text-white">...</span>
          )}
          
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`py-1.5 px-3 text-sm rounded-lg transition-all duration-200 ${
                pageNum === currentPage
                  ? "bg-white text-main font-bold scale-110"
                  : "bg-[#619e83] text-white hover:bg-[#267b49]"
              }`}
            >
              {pageNum}
            </button>
          ))}
          
          {/* 끝 생략 표시 */}
          {showEndEllipsis && (
            <span className="px-2 text-white">...</span>
          )}
        </div>

        {/* 다음 페이지 */}
        <button
          onClick={() => onPageChange(nextPage)}
          disabled={!hasNextGroup}
          className={`py-1.5 px-3 text-sm text-white border rounded-lg shadow-md transition-all duration-200 ease-in-out flex items-center gap-1 ${
            hasNextGroup
              ? "bg-[#619e83] border-[#619e83] hover:bg-[#267b49] hover:scale-x-105"
              : "bg-gray-400 border-gray-400 cursor-not-allowed opacity-50"
          }`}
        >
          {t("pagination.next")}
          <GrFormNext className="text-md" />
        </button>

        {/* 마지막 페이지 */}
        <button
          onClick={() => onPageChange(totalPage)}
          disabled={!hasNextGroup}
          className={`py-1.5 px-3 text-sm text-white border rounded-lg shadow-md transition-all duration-200 ease-in-out flex items-center gap-1 ${
            hasNextGroup
              ? "bg-[#619e83] border-[#619e83] hover:bg-[#267b49] hover:scale-x-105"
              : "bg-gray-400 border-gray-400 cursor-not-allowed opacity-50"
          }`}
        >
          {t("pagination.last")}
          <BiSkipNext className="text-md" />
        </button>
      </div>
    </div>
  );
}
