import { useNavigate } from "@tanstack/react-router";
import Lottie from "lottie-react";
import questionAndAnswer from "@/assets/lottie/help.json";
import { FadeInUp } from "@/components/animations";
import { cn } from "@/lib/utils";
import { helpMenuItems } from "./helpMenuItems";

type HelpMenuListProps = {
  showIntro?: boolean;
  linkBase?: "/webview/help" | "/help";
  onItemClick?: (id: number) => void;
};

export function HelpMenuList({
  showIntro = true,
  linkBase = "/webview/help",
  onItemClick,
}: HelpMenuListProps) {
  const navigate = useNavigate();

  const onDetail = (id: number) => () => {
    if (onItemClick) {
      onItemClick(id);
      return;
    }
    if (linkBase === "/help") {
      navigate({ to: "/help/$id", params: { id: String(id) } });
    } else {
      navigate({ to: "/webview/help/$id", params: { id: String(id) } });
    }
  };

  return (
    <>
      {showIntro && (
        <FadeInUp delay={0.1}>
          <div className="relative bg-gradient-to-br from-camaColor1/5 via-white to-blue-50/30 pt-3 pb-2 px-4">
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
      )}

      <FadeInUp delay={0.3}>
        <div className="px-5 py-6">
          <div className="max-w-md mx-auto grid grid-cols-1 gap-3">
            {helpMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "relative flex flex-col rounded-2xl bg-primary-thin/15 border-2 border-primary-light p-5 text-left transition-all",
                  )}
                  onClick={onDetail(item.id)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <p className="font-notoR font-bold text-gray-800">
                        {item.title}
                      </p>
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
    </>
  );
}
