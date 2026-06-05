import { useState } from "react";
import Lottie from "lottie-react";
import {
  Dumbbell,
  Heart,
  Search,
  Settings,
  Sparkles,
  UserPlus,
} from "lucide-react";
import questionAndAnswer from "@/assets/lottie/help.json";
import { FadeInUp } from "@/components/animations";
import { FontSizeController } from "@/components/FontSizeController";
import Popup from "@/components/ui/Popup";
import { cn } from "@/lib/utils";
import Detail1 from "@/components/layout/header/details/Detail1";
import Detail2 from "@/components/layout/header/details/Detail2";
import Detail3 from "@/components/layout/header/details/Detail3";
import Detail4 from "@/components/layout/header/details/Detail4";
import Detail5 from "@/components/layout/header/details/Detail5";
import Detail6 from "@/components/layout/header/details/Detail6";
import { notifyWebViewNavigation } from "@/lib/webview/rnBridge";
import { useEffect } from "react";

const menuItems = [
  {
    id: 1,
    title: "회원가입 · 로그인",
    description: "Cama+ 회원가입과 로그인",
    icon: UserPlus,
    color: "text-pink-400",
    bgColor: "bg-pink-50",
    hoverColor: "group-hover:text-pink-500",
  },
  {
    id: 2,
    title: "암정보가이드 설정",
    description: "맞춤 암정보를 설정하고 관리",
    icon: Settings,
    color: "text-purple-400",
    bgColor: "bg-purple-50",
    hoverColor: "group-hover:text-purple-500",
  },
  {
    id: 3,
    title: "암정보 검색방법",
    description: "원하는 암정보를 검색하고 알아보기",
    icon: Search,
    color: "text-blue-400",
    bgColor: "bg-blue-50",
    hoverColor: "group-hover:text-blue-500",
  },
  {
    id: 4,
    title: "콘텐츠 즐겨찾기",
    description: "콘텐츠를 저장하고 쉽게 다시 찾아보기",
    icon: Heart,
    color: "text-rose-400",
    bgColor: "bg-rose-50",
    hoverColor: "group-hover:text-rose-500",
  },
  {
    id: 5,
    title: "웰빙자원 안내",
    description: "건강한 삶을 위한 자원연결",
    icon: Sparkles,
    color: "text-amber-400",
    bgColor: "bg-amber-50",
    hoverColor: "group-hover:text-amber-500",
  },
  {
    id: 6,
    title: "건강코칭 사용법",
    description: "생활 습관개선을 위한 맞춤형코칭",
    icon: Dumbbell,
    color: "text-emerald-400",
    bgColor: "bg-emerald-50",
    hoverColor: "group-hover:text-emerald-500",
  },
];

const detailMap: Record<string, React.ReactNode> = {
  "1": <Detail1 />,
  "2": <Detail2 />,
  "3": <Detail3 />,
  "4": <Detail4 />,
  "5": <Detail5 />,
  "6": <Detail6 />,
};

/** /webview/help — cama-plus-app HelpPageMainScreen */
export function HelpPageContent() {
  const [detail, setDetail] = useState({
    visible: false,
    clickedId: 1,
  });

  useEffect(() => {
    notifyWebViewNavigation();
  }, []);

  const onDetail = (index: number) => () => {
    setDetail({ visible: true, clickedId: index });
  };

  return (
    <div className="min-h-dvh bg-white">
      <FadeInUp delay={0.1}>
        <div className="relative bg-gradient-to-br from-camaColor1/5 via-white to-blue-50/30 pt-3 pb-2 px-4">
          <div className="flex-center gap-4 font-jalnan">
            <div className="text-xl-fixed">
              <p className="text-camaColor1 font-bold drop-shadow-sm">안녕하세요,</p>
              <p className="font-semibold text-gray-700">도움이 필요하신가요?</p>
            </div>
            <Lottie animationData={questionAndAnswer} className="w-28 h-28" />
          </div>
        </div>
      </FadeInUp>
      <FadeInUp delay={0.3}>
        <div className="px-5 py-6">
          <div className="max-w-md mx-auto grid grid-cols-1 gap-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isClicked = detail.clickedId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "group relative flex flex-col justify-between rounded-2xl bg-primary-thin/15 border-2 border-primary-light p-5 text-left transition-all",
                    isClicked ? "shadow-2xl border-primary" : "",
                  )}
                  onClick={onDetail(item.id)}
                >
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <p className="font-notoR font-bold text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <Icon size={32} className={item.color} strokeWidth={2.5} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </FadeInUp>

      <Popup
        open={detail.visible}
        setOpen={() => setDetail((p) => ({ ...p, visible: false }))}
        title={
          <div className="flex items-end">
            <FontSizeController />
          </div>
        }
        direction="bottom"
        className="bg-white"
      >
        {detailMap[String(detail.clickedId)] ?? <Detail1 />}
      </Popup>
    </div>
  );
}
