import Lottie from "lottie-react";
import { CheckCircle2, Lightbulb } from "lucide-react";
import infor from "@/assets/lottie/info.json";
import TTSButton from "@/components/TTSButton";
import ImageViewer from "./ImageViewer";

// 회원가입 및 로그인안내
export default function Detail1() {
  // TTS로 읽을 전체 텍스트
  const fullText = `
		CAMA+는 간편한 본인인증만으로 회원가입과 로그인이 동시에 완료됩니다.
		
		가입방법
		1. 앱 실행후 로그인 버튼을 눌러주세요.
		2. 현재 사용중인 이동통신사를 선택해 주세요.
		3. 인증방식 선택. PASS 앱 인증 또는 문자메시지 SMS 인증. 원하는 방식을 선택해 본인 인증을 진행합니다.
		인증 완료 시 자동 로그인 및 회원가입 완료!
		
		별도의 가입 절차 없이 인증만으로 CAMA+ 사용을 시작할 수 있어요.
	`;

  return (
    <>
      {/* TTS 버튼 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex justify-end">
        <TTSButton text={fullText} rate={1.0} showVoiceSelector={true} />
      </div>

      <div className="bg-primary/15  p-4  flex-center flex-col">
        <Lottie animationData={infor} className="w-20 h-20" />
        <div className="text-center ">
          <p className="text-lg text-gray-800">
            <span className="font-bold text-camaColor1">CAMA+ </span>
            <span className="font-medium">는 간편한 본인인증만으로</span>
          </p>
          <p className="text-base text-gray-700 font-medium">
            회원가입과 로그인이 동시에 완료됩니다.
          </p>
        </div>
      </div>
      <div className=" px-5  py-2">
        <div className="mt-2 ">
          <ImageViewer type="login" />
        </div>
        <div className="mt-5">
          <p className="flex items-center gap-1">
            <CheckCircle2 className="text-[#39906a]" size={24} />
            가입방법
          </p>
          <div className="flex flex-col gap-1 mt-4">
            <p>
              1. 앱 실행후 <span className=" text-camaColor1 ">[로그인]</span>{" "}
              버튼을 눌러주세요.
            </p>
            <p>
              2. 현재 사용중인{" "}
              <span className=" text-camaColor1 ">이동통신사</span> 를 선택해
              주세요.
            </p>
            <p>3. 인증방식 선택</p>
            <p>
              <span className=" text-camaColor1 ">
                - PASS 앱 인증 또는 문자메시지(SMS)인증{" "}
              </span>
            </p>
            <p>원하는 방식을 선택해 본인 인증을 진행합니다.</p>
            <p className="flex items-center mt-5 font-semibold gap-1">
              <Lightbulb className="text-[#39906a]" size={24} />
              인증 완료 시 자동 로그인 및 회원가입 완료!
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#d0e7d3] py-6 px-5 flex flex-col items-center mt-3  bg-opacity-55 ">
        <p className="leading-relaxed font-semibold text-center">
          별도의 가입 절차 없이 인증만으로{" "}
        </p>
        <p className="leading-relaxed font-semibold text-center">
          <span className="text-camaColor1 font-semibold">CAMA+</span> 사용을
          시작할 수 있어요.
        </p>
      </div>
    </>
  );
}
