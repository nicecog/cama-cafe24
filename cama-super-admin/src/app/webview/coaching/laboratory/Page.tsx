import { FcHighPriority } from "react-icons/fc";
import Picture from "./Picture";
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import useAlert from "@/hooks/useAlert";
export default function Laboratory() {
  const { confirm } = useAlert();

  // Login Id
  const { loginId } = useParams();
  // Nav
  const navigate = useNavigate();
  // Back
  const onBack = () => {
    confirm("초기메뉴로 돌아갑니다.", () => {
      navigate(`/webview/coaching/${loginId}`, { state: { reload: true } });
    });
  };
  return (
    <>
      <div className="flex flex-col h-dvh">
        <div className="fixed top-0 w-full bg-white z-10">
          <div className="bg-white h-[50px] flex justify-center items-center px-3 border-b">
            <button onClick={onBack} className="absolute top-3.5 left-2">
              <MdClose className="text-[#BBBBBB] font-extrabold text-[23px]" />
            </button>
            <span className="text-base font-medium text-text">
              카마닥터 실험실
            </span>
          </div>
        </div>
        {/* content */}
        <div
          className={`flex-grow bg-[#F9F9F9] mt-[50px]  pb-[10px] pt-2 w-full overflow-auto `}
        >
          <div className="px-[20px] py-5 h-full flex flex-col  ">
            <div className="flex items-center gap-2">
              <FcHighPriority className="text-[25px]" />
              <h2 className="font-scDream font-extralight text-sm  w-full">
                실험실기능은 오류를 발생 시킬수 있습니다.
              </h2>
            </div>
            {/* 사진 업로드 하기  */}

            <Picture />
          </div>
        </div>
      </div>
    </>
  );
}
