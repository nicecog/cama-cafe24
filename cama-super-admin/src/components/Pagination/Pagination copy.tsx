import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { FcList } from "react-icons/fc";
export default function Pagination(props: any) {
  const { startNum, displayRow, totalCount, currentPage, onClick } = props;

  const onPrev = () => {
    onClick(currentPage - 1);
  };

  const onNext = () => {
    onClick(currentPage + 1);
  };

  return (
    <div className="p-2 mt-2 flex  items-center justify-between  bg-main bg-opacity-15 rounded-lg border">
      <div className="flex text-sm gap-3 items-center">
        <FcList className="text-[18px] -mr-1" />
        <span>{`${+startNum + 1} / ${startNum + +displayRow}`}</span>
        <span>Total {totalCount} 건</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          className="py-1.5 px-3 text-sm text-white bg-[#39906a] rounded-lg shadow-md hover:bg-[#267b49] transition-all duration-200 ease-in-out flex items-center gap-1"
        >
          <GrFormPrevious className="text-md" />
          이전
        </button>
        <button
          onClick={onNext}
          className="py-1.5 px-3 text-sm text-white bg-[#39906a] rounded-lg shadow-md hover:bg-[#267b49] transition-all duration-200 ease-in-out flex items-center gap-1"
        >
          다음
          <GrFormNext className="text-md" />
        </button>
      </div>
    </div>
  );
}
