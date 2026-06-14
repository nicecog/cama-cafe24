import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { checkHospitalService } from "@/apis/api/hospital";
import { isScrolledAtom } from "@/atoms/scrollAtom";
import CancerInfoGuide from "@/components/CancerInfoGuide";
import Dockbar from "@/components/layout/dockbar/dockbar";
import Header from "@/components/layout/header/Header";
import ThemeColorController from "@/components/ThemeColorController";
import { getTokenEncryptedStorage } from "@/lib/encryptedStorage";
import { isReactNativeWebView } from "@/lib/webview/rnBridge";

export const Route = createFileRoute("/_auth/_layout")({
  beforeLoad: async ({ location }) => {
    const token = await getTokenEncryptedStorage();
    if (!token) {
      return;
    }

    const check = await checkHospitalService().catch(() => null);
    if (check?.response === "NOT_SERVICE") {
      throw redirect({
        to: "/hospital/select",
        search: { redirect: location.href },
      });
    }
  },
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
