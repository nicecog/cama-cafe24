import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipPrevious } from "react-icons/bi";
import { FaRegListAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Pagination(props: any) {
  const { startNum, displayRow, currentPage, totalPage, onClick } = props;
  const { t } = useTranslation();

  const onPrev = () => {
    // 1페이지보다 작아지지 않도록 방지
    if (currentPage > 1) {
      onClick(currentPage - 1);
    }
  };

  const onNext = () => {
    // totalPage가 제공되고 유효한 경우에만 체크
    if (totalPage && currentPage < totalPage) {
      onClick(currentPage + 1);
    } else if (!totalPage) {
      // totalPage가 없으면 제한 없이 진행
      onClick(currentPage + 1);
    }
  };

  return (
    <div className="p-2 mt-2 flex  items-center justify-between  bg-main text-white rounded-lg border">
      <div className="flex text-sm gap-3 items-center">
        <FaRegListAlt className="text-[18px] -mr-1" />
        <span>
          {t("pagination.itemPrefix")}{+startNum + 1}{t("pagination.itemRange")}{startNum + +displayRow}{t("pagination.itemSuffix")}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onClick(1)}
          className="py-1.5 px-3 text-sm text-white bg-[#619e83]  border border-[#619e83]   rounded-lg shadow-md hover:bg-[#267b49] transition-all duration-200 ease-in-out hover:scale-x-105 flex items-center gap-1"
        >
          <BiSkipPrevious className="text-md" />
          {t("pagination.first")}
        </button>
        <button
          onClick={onPrev}
          className="py-1.5 px-3 text-sm text-white bg-[#619e83]  border border-[#619e83]   rounded-lg shadow-md hover:bg-[#267b49] transition-all duration-200 ease-in-out hover:scale-x-105 flex items-center gap-1"
        >
          <GrFormPrevious className="text-md" />
          {t("pagination.previous")}
        </button>
        <button
          onClick={onNext}
          className="py-1.5 px-3 text-sm text-white bg-[#619e83]  border border-[#619e83]   rounded-lg shadow-md hover:bg-[#267b49] transition-all duration-200 ease-in-out hover:scale-x-105 flex items-center gap-1"
        >
          {t("pagination.next")}
          <GrFormNext className="text-md" />
        </button>
      </div>
    </div>
  );
}
