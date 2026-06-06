import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

export default function Footer(props: {
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const { onPrev, onNext } = props;

  return (
    <div className="fixed bottom-0 w-full h-[60px] bg-white border-t left-0">
      <div className="flex justify-between items-center h-full w-full px-8">
        <button
          className={`text-camaColor text-f3 font-bold border border-[#F0F0F0] w-20 py-1.5 rounded-2xl flex justify-center items-end gap-0.5 ${
            onPrev ? "" : "text-[#BBBBBB] cursor-not-allowed"
          }`}
          onClick={onPrev ? onPrev : undefined}
          disabled={!onPrev}
        >
          <IoIosArrowDropleftCircle
            className={`text-xl ml-1 ${
              onPrev ? "text-camaColor1" : "text-[#BBBBBB]"
            }`}
          />
          이전
        </button>
        <button
          className={`text-camaColor text-f3 font-bold border border-[#F0F0F0] w-20 py-1.5 rounded-2xl flex justify-center items-end gap-0.5 ${
            onNext ? "" : "text-[#BBBBBB] cursor-not-allowed"
          }`}
          onClick={onNext ? onNext : undefined}
          disabled={!onNext}
        >
          다음
          <IoIosArrowDroprightCircle
            className={`text-xl ml-1 ${
              onNext ? "text-camaColor1" : "text-[#BBBBBB]"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
