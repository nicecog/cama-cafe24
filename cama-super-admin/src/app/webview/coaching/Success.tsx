import { useNavigate } from "react-router-dom";
import ImageBox from "./component/ImageBox";
import Clear from "@/assets/images/character/missionClear.png";
export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center items-center h-[90dvh] flex-col">
        <ImageBox imgSrc={Clear} className="w-[100px]" />
        <div className="text-xl font-bold text-green-600">
          모든 프로그램이 완료되엇습니다 !
        </div>
        <div className="mt-8 w-full px-20">
          <button
            className="border px-4 py-2 w-full rounded-md bg-green-300 font-semibold text-sm "
            onClick={() => {
              navigate(-1);
            }}
          >
            돌아가기
          </button>
        </div>
      </div>
    </>
  );
}
