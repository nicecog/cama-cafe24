import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipPrevious } from "react-icons/bi";
import { FaRegListAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface ClientPaginationProps {
  currentPage: number;
  totalCount: number;
  displayRow: number;
  onClick: (page: number) => void;
}

export default function ClientPagination(props: ClientPaginationProps) {
  const { currentPage, totalCount, displayRow, onClick } = props;
  const { t } = useTranslation();

  // 총 페이지 수 계산
  const totalPage = Math.ceil(totalCount / displayRow);
  
  // 현재 페이지의 시작/끝 번호
  const startNum = (currentPage - 1) * displayRow + 1;
  const endNum = Math.min(currentPage * displayRow, totalCount);

  const onPrev = () => {
    if (currentPage > 1) {
      onClick(currentPage - 1);
    }
  };

  const onNext = () => {
    if (currentPage < totalPage) {
      onClick(currentPage + 1);
    }
  };

  const onFirst = () => {
    if (currentPage !== 1) {
      onClick(1);
    }
  };

  return (
    <div className="p-2 mt-2 flex items-center justify-between bg-main text-white rounded-lg border">
      <div className="flex text-sm gap-3 items-center">
        <FaRegListAlt className="text-[18px] -mr-1" />
        <span>
          {totalCount > 0 ? (
            <>
              {t("pagination.itemPrefix")}{startNum}{t("pagination.itemRange")}{endNum}{t("pagination.itemSuffix")} 
            </>
          ) : (
            "데이터가 없습니다"
          )}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onFirst}
          disabled={currentPage === 1}
          className="py-1.5 px-3 text-sm text-white bg-[#619e83] border border-[#619e83] rounded-lg shadow-md hover:bg-[#267b49] transition-all duration-200 ease-in-out hover:scale-x-105 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#619e83] disabled:hover:scale-100"
        >
          <BiSkipPrevious className="text-md" />
          {t("pagination.first")}
        </button>
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="py-1.5 px-3 text-sm text-white bg-[#619e83] border border-[#619e83] rounded-lg shadow-md hover:bg-[#267b49] transition-all duration-200 ease-in-out hover:scale-x-105 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#619e83] disabled:hover:scale-100"
        >
          <GrFormPrevious className="text-md" />
          {t("pagination.previous")}
        </button>
        
        {/* 페이지 번호 표시 */}
        {/* <div className="flex items-center gap-2 px-3 text-sm font-medium">
          <span>{currentPage}</span>
          <span className="text-gray-300">/</span>
          <span>{totalPage || 1}</span>
        </div> */}

        <button
          onClick={onNext}
          disabled={currentPage >= totalPage || totalCount === 0}
          className="py-1.5 px-3 text-sm text-white bg-[#619e83] border border-[#619e83] rounded-lg shadow-md hover:bg-[#267b49] transition-all duration-200 ease-in-out hover:scale-x-105 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#619e83] disabled:hover:scale-100"
        >
          {t("pagination.next")}
          <GrFormNext className="text-md" />
        </button>
      </div>
    </div>
  );
}
