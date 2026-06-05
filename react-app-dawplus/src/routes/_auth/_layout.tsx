import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { isScrolledAtom } from "@/atoms/scrollAtom";
import CancerInfoGuide from "@/components/CancerInfoGuide";
import Dockbar from "@/components/layout/dockbar/dockbar";
import Header from "@/components/layout/header/Header";
import ThemeColorController from "@/components/ThemeColorController";
import { isReactNativeWebView } from "@/lib/webview/rnBridge";

export const Route = createFileRoute("/_auth/_layout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  const setIsScrolled = useSetAtom(isScrolledAtom);
  const inRnWebView = isReactNativeWebView();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 10);
  };

  return (
    <div className="w-dvw h-dvh flex justify-center overflow-hidden ">
      {/* Safari 노치/상태바 색상 동적 제어 */}
      <ThemeColorController />

      {/* Main Content */}
      <main className="flex flex-col flex-1 min-w-0">
        {!inRnWebView && <Header />}
        <div
          id={import.meta.env.VITE_MAIN_SCROLL_CONTAINER_ID}
          onScroll={handleScroll}
          className="flex-1 flex flex-col overflow-auto hide-scrollbar min-w-0 text-slate-800  "
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
            overflowAnchor: "none",
            overscrollBehaviorY: "none",
          }}
        >
          <Outlet />
        </div>
        {!inRnWebView && <Dockbar />}
      </main>

      {/* 전역 암정보 가이드 팝업 */}
      <CancerInfoGuide />
    </div>
  );
}
