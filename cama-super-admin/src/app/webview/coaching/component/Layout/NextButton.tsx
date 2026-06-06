import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
export default function NextButton(props: any) {
  // Props
  const { onPrev, onNext } = props;

  return (
    <>
      <div className="fixed bottom-0 w-full h-[60px] bg-white  border-t ">
        <div className="flex justify-between items-center h-full w-full px-8">
          <button
            className={`text-camaColor text-f3 font-bold border border-[#F0F0F0] w-20 py-1.5 rounded-2xl flex justify-center items-end  gap-0.5 ${
              onPrev ? "" : "!text-[#BBBBBB]"
            }`}
            onClick={onPrev}
          >
            <IoIosArrowDropleftCircle
              className={`text-xl ml-1 text-camaColor1 
            ${onPrev ? "" : "!text-[#BBBBBB]"}
            `}
            />
            이전
          </button>
          <button
            className={`text-camaColor text-f3 font-bold border border-[#F0F0F0] w-20 py-1.5 rounded-2xl flex justify-center items-end  gap-0.5 ${
              !onNext && "!text-[#BBBBBB]"
            }`}
            onClick={onNext}
          >
            다음
            <IoIosArrowDroprightCircle
              className={`text-xl ml-1 text-camaColor1
               ${!onNext && "!text-[#BBBBBB]"}
            `}
            />
          </button>
        </div>
      </div>
    </>
  );
}
