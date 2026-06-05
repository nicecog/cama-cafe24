import { Activity, Lightbulb } from "lucide-react";
import advice from "@/assets/images/character/advice2.png";
import sleep from "@/assets/images/coaching/main/type1.png";
import dietary from "@/assets/images/coaching/main/type2.png";
import mental from "@/assets/images/coaching/main/type3.png";
import activity from "@/assets/images/coaching/main/type4.png";
import excercise from "@/assets/images/coaching/main/type5.png";

import ImageViewer from "./ImageViewer";

//암정보 검색방법
export default function Detail6() {
  return (
    <>
      <div className="text-center bg-[#d0e7d3] py-4 flex flex-col items-center bg-opacity-55  px-5 ">
        <p className="flex items-center  font-semibold gap-2 mb-2 text-lg">
          <Activity className="text-2xl text-[#39906a]" size={28} />
          건강코칭 사용법 안내
        </p>
        <img src={advice} className="w-20 mb-2" alt="advice" />
      </div>
      <div className=" px-5  py-2">
        <p className="text-center py-5 font-semibold">
          나만의 생활습관 개선을 위한 맞춤형 코칭, <br />
          이렇게 시작하세요!
        </p>

        <div className="mt-2 ">
          <ImageViewer type="type6" />
        </div>
        <div className="flex flex-col gap-4 mt-6">
          {/* Step 1 */}
          <div className="flex items-start gap-2 border-t pt-4">
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold mt-0.5 p-1.5 text-sm">
              1
            </span>

            <div className="text-gray-700 text-justify">
              <p>
                <span className="font-semibold text-[#39906a] ">
                  건강코칭 진입하기
                </span>
              </p>
              <p>
                홈 화면 또는 하단 메뉴에서{" "}
                <span className="font-semibold text-[#39906a] ">
                  [건강코칭]
                </span>{" "}
                탭을 선택합니다.
              </p>
              <p>
                홈 화면의 건강코칭 정보 에서{" "}
                <span className="font-semibold text-[#39906a] ">[이동]</span>{" "}
                버튼을 눌러 건강 영역별 코칭 화면으로 들어가요.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-2 border-t pt-4">
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold mt-0.5 p-1.5 text-sm">
              2
            </span>

            <div className="text-gray-700 text-justify">
              <p>
                <span className="font-semibold text-[#39906a] ">
                  영역 선택하기
                </span>
              </p>
              <p className="font-semibold">
                건강코칭은 총 5개 영역으로 구성돼있어요
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              {
                icon: sleep,
                title: "수면",
                desc: "수면 습관 자가진단 및 개선 코칭",
              },
              {
                icon: dietary,
                title: "식습관",
                desc: "식이 관리 행동 점검 및 맞춤 피드백",
              },
              {
                icon: activity,
                title: "신체활등",
                desc: "일상 속 운동 및 활동 습관 관리",
              },
              {
                icon: mental,
                title: "심리",
                desc: "마음 건강과 스트레스 조절 코칭",
              },
              {
                icon: excercise,
                title: "운동하기",
                desc: "맞춤형 운동 프로그램",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className=" px-4 py-2 rounded-xl shadow-md border bg-[#39906a] bg-opacity-10 border-gray-200 flex items-center gap-1 h-full"
              >
                {/* 아이콘 영역 */}
                <div className="flex items-center gap-3">
                  <img
                    src={icon}
                    className="w-10 h-14"
                    alt={`${title} 아이콘`}
                  />
                  <div>
                    <p className="text-gray-800 font-semibold text-lg">
                      {title}
                    </p>
                    <p className="text-gray-600 text-sm">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Step 3*/}
          <div className="flex items-start gap-2 border-t pt-4">
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold mt-0.5 p-1.5 text-sm">
              3
            </span>
            <div className="text-gray-700 text-justify">
              <p>
                <span className="font-semibold text-[#39906a] ">
                  16일의 도전! 미션 시작
                </span>{" "}
              </p>
              <p className="text-sm">
                각 코칭은 최대 16회차 까지 구성 돼있으며,
              </p>
              <p className="text-sm">
                <span className="font-semibold text-[#39906a]">
                  1일차 → 2일차
                </span>{" "}
                식으로 순서대로 진행됩니다.
              </p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg  flex items-start gap-2">
            <p className="text-[#39906a] font-semibold text-base">
              진행률(%)이 기록되므로 꾸준히 실천하며 체크해보세요!
            </p>
          </div>

          {/* Step 4*/}
          <div className="flex items-start gap-2 border-t pt-4">
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold mt-0.5 p-1.5 text-sm">
              4
            </span>
            <div className="text-gray-700 text-justify">
              <p>
                <span className="font-semibold text-[#39906a] ">
                  운동코칭의 경우 [운동평가] 먼저
                </span>
              </p>
              <p className="">
                [운동하기] 영역은 시작 전 간단한 운동능력 평가가 먼저
                진행됩니다.
              </p>
              <p className="text-sm">
                <span className="font-semibold text-[#39906a] ">
                  시작하기 → 평가시작
                </span>{" "}
                버튼을 눌러 진행하세요.
              </p>
              <p className="text-sm">
                평가 결과에 따라 나에게 맞는 운동 수준이 자동으로 설정돼요.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#d0e7d3] py-6 px-5 flex flex-col items-start mt-3  bg-opacity-55">
        <div className="flex items-center gap-2  font-bold text-[#39906a] border-l-4 border-[#39906a] pl-2 mb-3 text-2xl">
          <Lightbulb className="text-3xl text-[#39906a]" size={28} />
          TIP
        </div>

        <p className="leading-relaxed font-semibold">
          모든 코칭은{" "}
          <span className="text-[#39906a]">자가진단 + 맞춤형 패드백</span>{" "}
          형식으로 진행됩니다. 언제든지{" "}
        </p>
        <p className="leading-relaxed font-semibold mt-2">
          하루에 1개씩, 천천히 실천하며 나만의 건강 루틴을 만들어 보세요!
        </p>
      </div>
    </>
  );
}
