import { Bookmark, Headset, Lightbulb } from "lucide-react";
import advice from "@/assets/images/character/advice2.png";
import ImageViewer from "./ImageViewer";

// 암정보가이드 설정방법

export default function Detail2() {
  return (
    <>
      <div className="text-center bg-[#d0e7d3] py-4 flex flex-col items-center bg-opacity-55  px-5 ">
        <p className="flex items-center  font-semibold gap-2 mb-2 text-lg">
          <Headset className="text-2xl text-[#39906a]" size={28} />
          암정보 가이드 설정방법
        </p>
        <img src={advice} className="w-20 mb-2" alt="advice" />
      </div>
      <div className=" px-5  py-2">
        <p className="text-center py-5 font-semibold">
          회원가입이 완료되면, 이제 나에게 맞는 암정보 콘텐츠를 설정해볼
          차례예요!
        </p>
        <div className="mt-2 ">
          <ImageViewer type="type2_1" />
        </div>
        <div className="mt-5">
          <div className="flex flex-col gap-4 mt-6">
            {/* Step 1 */}
            <div className="flex items-start gap-2 border-t pt-4">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold  mt-0.5 p-1.5 text-sm">
                1
              </span>

              <div className="text-gray-700 text-justify">
                <p>
                  <span className="font-semibold text-[#39906a] ">
                    [암정보 가이드 설정하기]
                  </span>{" "}
                  버튼 클릭 홈 화면 상단에 보이는{" "}
                  <span className="font-semibold">
                    '암정보 가이드 설정하기'
                  </span>
                  를 눌러주세요.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 border-t pt-4 ">
              <div className="text-gray-700 text-justify font-semibold">
                <p>나에게 필요한 정보를 매일 추천받을 수 있는 첫걸음입니다.</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex items-start gap-2 border-t pt-4">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold mt-0.5 p-1.5 text-sm">
                2
              </span>

              <div className="text-gray-700 text-justify">
                <p className="font-semibold">본인암종 선택</p>
                <p className="">
                  화면에 보이는 암 종류 중 해당되는 암종을 선택하세요.{" "}
                  <span className="text-xs text-gray-600 font-semibold">
                    (예: 유방암, 대장암, 폐암, 갑상선암 등)
                  </span>
                </p>
                <p className=" text-gray-600">
                  선택 후{" "}
                  <span className="font-semibold text-[#39906a]">[다음]</span>을
                  눌러 단계를 진행합니다.
                </p>
              </div>
            </div>

            {/* Step 3*/}
            <div className="flex items-start gap-2 border-t pt-4">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold mt-0.5 p-1.5 text-sm">
                3
              </span>

              <div className="text-gray-700 text-justify">
                <p className="text-sm">
                  이후 치료 시기, 증상 등 간단한 추가 정보를 입력하면 설정 완료!
                </p>
                <p className="text-gray-600 text-sm">
                  설정이 완료되면 홈 화면 하단에{" "}
                  <span className="font-semibold text-[#39906a]">
                    '오늘의 암정보'
                  </span>{" "}
                  콘텐츠가 자동으로 보여집니다.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg mt-10 flex items-start gap-2">
          <Bookmark
            className="text-2xl text-[#39906a] flex-shrink-0"
            size={24}
          />
          <h2 className="text-[#39906a] font-semibold ">
            설정한 내용은{" "}
            <p className="text-black whitespace-nowrap">
              [마이페이지] ▶ [암정보설정]
            </p>{" "}
            에서 언제든지 변경할 수 있어요
          </h2>
        </div>

        {/* 사진  */}
        <div className="mt-5 ">
          <ImageViewer type="type2_2" />
        </div>
        {/* 사진끝  */}

        {/* 설명 */}
        <div className="flex flex-col gap-4 mt-6">
          {/* Step 1 */}
          <div className="flex items-start gap-2 border-t pt-4">
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold mt-0.5 p-1.5 text-sm">
              1
            </span>

            <div className="text-gray-700 text-justify">
              <p>
                <span className="font-semibold text-[#39906a] ">
                  마이페이지 접속
                </span>{" "}
                홈 화면 우측 상단의 user 을 눌러{" "}
                <span className="font-semibold text-[#39906a] ">
                  마이페이지
                </span>{" "}
                로 이동합니다.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-2 border-t pt-4">
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold mt-0.5 p-1.5 text-sm">
              2
            </span>

            <div className="text-gray-700 text-justify">
              <p className="font-semibold">진행중인 암정보 가이드 클릭</p>
            </div>
          </div>

          {/* Step 3*/}
          <div className="flex items-start gap-2 border-t pt-4">
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold mt-0.5 p-1.5 text-sm">
              3
            </span>
            <div className="text-gray-700 text-justify">
              <p>
                <span className="font-semibold text-[#39906a] ">
                  암정보 가이드 중단
                </span>{" "}
                선택
              </p>
              <p className="text-sm">
                가이드를 터치하면 상세 정보가 열립니다. 하단의{" "}
                <span className="font-semibold text-[#39906a]">
                  [암정보 가이드 중단]
                </span>{" "}
                버튼을 누르세요.
              </p>
            </div>
          </div>
          {/* Step 4*/}
          <div className="flex items-start gap-2 border-t pt-4">
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold  mt-0.5 p-1.5 text-sm">
              4
            </span>
            <div className="text-gray-700 text-justify">
              <p>
                <span className="font-semibold text-[#39906a] ">중단확인</span>
              </p>
              <p className="">
                <span className="font-semibold text-[#39906a]">
                  "암정보 가이드를 정말 중단할가요?"
                </span>{" "}
                라는 확인 팝업에서{" "}
                <span className="font-semibold text-[#39906a]">[네]</span> 를
                선택.
              </p>
              <p className="">
                가이드가 중단되면 홈 화면 상단에{" "}
                <span className="font-semibold text-[#39906a]">
                  [암정보 가이드 설정하기]
                </span>{" "}
                버튼이 다시 나타납니다.
              </p>
            </div>
          </div>
        </div>
        {/* 설명 끝 */}
      </div>
      <div className="bg-[#d0e7d3] py-6 px-5 flex flex-col items-start mt-3  bg-opacity-55">
        <div className="flex items-center gap-2   font-bold text-[#39906a] border-l-4 border-[#39906a] pl-2 mb-3">
          <Lightbulb className="text-3xl text-[#39906a]" size={28} />
          TIP
        </div>

        <p className="leading-relaxed  font-semibold">
          암정보가 바뀌었거나 관심 주제가 달라졌다면 <br />
          언제든지 <span className="text-[#39906a]">재설정</span>할 수 있어요.
        </p>
        <p className="leading-relaxed  font-semibold mt-2">
          단,{" "}
          <span className="text-[#39906a]">
            중단하면 기존 진행 정보(%)가 초기화
          </span>
          되니 신중히 결정하세요.
        </p>
      </div>
    </>
  );
}
