import { useAtom } from "jotai";
import Lottie from "lottie-react";
import {
  Dumbbell,
  Heart,
  Search,
  Settings,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import questionAndAnswer from "@/assets/lottie/help.json";
import { HelpPopupAtom } from "@/atoms/CommonAtoms";
import { FadeInUp } from "@/components/animations";
import { FontSizeController } from "@/components/FontSizeController";
import Popup from "@/components/ui/Popup";
import { cn } from "@/lib/utils";
import Detail1 from "./details/Detail1";
import Detail2 from "./details/Detail2";
import Detail3 from "./details/Detail3";
import Detail4 from "./details/Detail4";
import Detail5 from "./details/Detail5";
import Detail6 from "./details/Detail6";

const menuItems = [
  {
    id: 1,
    title: "회원가입 · 로그인",
    description: "Cama+ 회원가입과 로그인",
    icon: UserPlus,
    color: "text-pink-400", // Pastel Pink
    bgColor: "bg-pink-50",
    hoverColor: "group-hover:text-pink-500",
  },
  {
    id: 2,
    title: "암정보가이드 설정",
    description: "맞춤 암정보를 설정하고 관리",
    icon: Settings,
    color: "text-purple-400", // Pastel Purple
    bgColor: "bg-purple-50",
    hoverColor: "group-hover:text-purple-500",
  },
  {
    id: 3,
    title: "암정보 검색방법",
    description: "원하는 암정보를 검색하고 알아보기",
    icon: Search,
    color: "text-blue-400", // Pastel Blue
    bgColor: "bg-blue-50",
    hoverColor: "group-hover:text-blue-500",
  },
  {
    id: 4,
    title: "콘텐츠 즐겨찾기",
    description: "콘텐츠를 저장하고 쉽게 다시 찾아보기",
    icon: Heart,
    color: "text-rose-400", // Pastel Rose
    bgColor: "bg-rose-50",
    hoverColor: "group-hover:text-rose-500",
  },
  {
    id: 5,
    title: "웰빙자원 안내",
    description: "건강한 삶을 위한 자원연결",
    icon: Sparkles,
    color: "text-amber-400", // Pastel Amber
    bgColor: "bg-amber-50",
    hoverColor: "group-hover:text-amber-500",
  },
  {
    id: 6,
    title: "건강코칭 사용법",
    description: "생활 습관개션을 위한 맞춤형코칭",
    icon: Dumbbell,
    color: "text-emerald-400", // Pastel Emerald
    bgColor: "bg-emerald-50",
    hoverColor: "group-hover:text-emerald-500",
  },
];

export default function Help() {
  const [detail, setDetail] = useState({
    visible: false,
    clickedId: 1,
    title: "도움말 상세보기",
  });

  const onDetail = (index: number) => () => {
    setDetail({
      visible: true,
      clickedId: index,
      title: menuItems[index - 1].title,
    });
  };

  const [open, setOpen] = useAtom(HelpPopupAtom);

  return (
    <Popup
      open={open}
      setOpen={setOpen}
      title="도움말"
      direction="right"
      className="bg-white"
    >
      {/* Header Section with Gradient Background */}
      <FadeInUp delay={0.1}>
        <div className="relative bg-gradient-to-br from-camaColor1/5 via-white to-blue-50/30 pt-3 pb-2 px-4 ">
          <div className="flex-center gap-4 font-jalnan">
            <div className="text-xl-fixed">
              <p className="text-camaColor1 font-bold drop-shadow-sm">
                안녕하세요,
              </p>
              <p className="font-semibold text-gray-700">
                도움이 필요하신가요?
              </p>
            </div>
            <Lottie animationData={questionAndAnswer} className="w-28 h-28" />
          </div>
        </div>
      </FadeInUp>
      <FadeInUp delay={0.3}>
        {/* Menu Grid Section */}
        <div className=" px-5 py-6">
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-1 gap-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isClicked = detail.clickedId === item.id;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "group relative flex flex-col justify-between rounded-2xl bg-primary-thin/15 border-2 border-primary-light p-5 transition-all duration-300 ease-out cursor-pointer hover:scale-101",
                      isClicked ? "shadow-2xl border-primary " : "",
                    )}
                    onClick={onDetail(item.id)}
                  >
                    {/* Subtle Background Gradient */}
                    <div
                      className={`absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <div className="flex-1 flex flex-col gap-1.5">
                        <p className="font-notoR font-bold text-gray-800 leading-snug group-hover:text-gray-900 transition-colors duration-300">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors duration-300">
                          {item.description}
                        </p>
                      </div>

                      {/* Icon with Pastel Color */}
                      <div
                        className={`${item.color} ${item.hoverColor} transition-all duration-500 transform group-hover:scale-125 group-hover:rotate-12`}
                      >
                        <Icon size={32} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* 상세 팝업: Help 팝업 위에 중첩되어 표시 */}
      <Popup
        open={detail.visible}
        setOpen={() => {
          setDetail((prev) => ({
            ...prev,
            visible: false,
          }));
        }}
        title={
          <div className="flex items-end  ">
            <FontSizeController />
          </div>
        }
        direction="bottom"
        className="bg-white"
      >
        {
          {
            "1": <Detail1 />,
            "2": <Detail2 />,
            "3": <Detail3 />,
            "4": <Detail4 />,
            "5": <Detail5 />,
            "6": <Detail6 />,
          }[detail.clickedId || "1"]
        }
      </Popup>
    </Popup>
  );
}
