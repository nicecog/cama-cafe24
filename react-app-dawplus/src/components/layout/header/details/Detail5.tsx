import {
  Building2,
  FolderOpen,
  Heart,
  Salad,
  Settings,
  Sparkles,
} from "lucide-react";
import advice from "@/assets/images/character/advice2.png";
import image1 from "../details/images/detail5.png";

//암정보 검색방법
export default function Detail5() {
  return (
    <>
      <div className="text-center bg-[#d0e7d3] py-4 flex flex-col items-center bg-opacity-55  px-5 ">
        <p className="flex items-center  font-semibold gap-2 mb-2 text-lg">
          <Sparkles className="text-2xl text-[#39906a]" size={28} />
          웰빙자원 안내
        </p>
        <img src={advice} className="w-20 mb-2" alt="advice" />
      </div>
      <div className=" px-5  py-2">
        <p className="text-center pt-5 font-semibold text-xl">웰빙자원이란?</p>
        <p className="text-center  pt-2 font-semibold">
          <span className="text-camaColor1 font-semibold">CAMA+ </span> 에서
          제공하는 운동, 심리, 식이, 기타 생활지원 분야의 공공·민간자원 정보를
          말해요.
        </p>
        <p className="text-center text-gray-600  mt-2 text-sm">
          암 생존자들이 치료 이후에도 더 나은 일상으로 회복할 수 있도록 돕는
          다양한 프로그램과 서비스를 한눈에 확인하고 연결할 수 있도록 제공돼요.
        </p>
        <div className="mt-2 ">
          <img src={image1} className="w-full" alt="wellbeing resources" />
        </div>
        <div className="mt-5">
          <p className="flex items-center font-semibold gap-2 mt-2">
            <FolderOpen className="text-[#39906a]" size={20} />
            카테고리별 자원 보기
          </p>
          <div className="space-y-3 mt-2">
            {[
              {
                icon: <Sparkles className="text-blue-500" size={24} />,
                title: "운동",
                desc: "재활운동, 운동센터, 걷기모임 등",
              },
              {
                icon: <Heart className="text-rose-500" size={24} />,
                title: "심리",
                desc: "심리상담, 명상프로그램, 마음돌봄 자원",
              },
              {
                icon: <Salad className="text-green-500" size={24} />,
                title: "식이",
                desc: "영양상담, 건강식단 안내, 식생활 프로그램",
              },
              {
                icon: <Building2 className="text-purple-500" size={24} />,
                title: "기타",
                desc: "병원동행, 돌봄서비스, 복지연계 등 생활지원 서비스",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start  gap-2 bg-gray-100 p-3 rounded-lg"
              >
                <span className="mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                  <p className="text-gray-700 font-semibold">{title}</p>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-600 font-semibold mt-3  px-2 text-sm">
            <span className="text-[#39906a] font-semibold">[전체] </span>를
            선택하면 모든 카테고리의 자원을 한꺼번에 볼 수 있어요.
          </p>
          <div className="mt-10">
            <p className="flex items-center font-semibold gap-2 mt-2">
              <Settings className="text-[#39906a]" size={20} />
              자원 이용 방법
            </p>
            <div className="space-y-3 mt-2">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-gray-700 font-semibold">
                  관심있는 자원 클릭
                </p>
                <p className="text-gray-500 text-sm">
                  상세설명, 연락처, 위치, 제공 서비스 내용 등을 확인할 수
                  있어요.
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-gray-700 font-semibold">
                  기관에 직접 문의 또는 방문 연계
                </p>
                <p className="text-gray-500 text-sm">
                  앱은 자원 정보를 제공하고, 실제 이용은 기관별 안내에 따라
                  진행됩니다.
                </p>
                <p className="text-gray-500 text-sm">
                  새로 추가되거나 업데이트된 자원은 주기적으로 반영돼요
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-gray-700 font-semibold">
                  새로 추가되거나 업데이트된 자원은 주기적으로 반영돼요
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#d0e7d3] py-6 px-5 flex flex-col items-start mt-3  bg-opacity-55"></div>
    </>
  );
}
