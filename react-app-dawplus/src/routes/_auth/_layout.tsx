import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import * as React from "react";
import { checkHospitalService } from "@/apis/api/hospital";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { authSessionAtom, setAuthSessionAtom } from "@/atoms/authSessionAtom";
import { isScrolledAtom } from "@/atoms/scrollAtom";
import CancerInfoGuide from "@/components/CancerInfoGuide";
import Dockbar from "@/components/layout/dockbar/dockbar";
import Header from "@/components/layout/header/Header";
import ThemeColorController from "@/components/ThemeColorController";
import { WebViewLogoHeader } from "@/components/webview/WebViewLogoHeader";
import {
  getTokenEncryptedStorage,
  removeTokenEncryptedStorage,
} from "@/lib/encryptedStorage";
import { queryClient } from "@/lib/queryClient";
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
  const setAuthSession = useSetAtom(setAuthSessionAtom);
  const inRnWebView = isReactNativeWebView();
  const showWebViewLogoHeader = inRnWebView;
  const session = useAtomValue(authSessionAtom);
  const accountMe = useAtomValue(accountMeAtom);
  const hasHandledInvalidSession = React.useRef(false);

  React.useEffect(() => {
    if (!session?.loginId) {
      hasHandledInvalidSession.current = false;
      return;
    }

    if (accountMe.isPending || accountMe.isFetching) {
      return;
    }

    if (accountMe.isError && !hasHandledInvalidSession.current) {
      hasHandledInvalidSession.current = true;
      void (async () => {
        await removeTokenEncryptedStorage();
        setAuthSession(null);
        queryClient.clear();
        window.location.href = "/webview";
      })();
    }
  }, [
    accountMe.isError,
    accountMe.isFetching,
    accountMe.isPending,
    session?.loginId,
    setAuthSession,
  ]);

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
        {showWebViewLogoHeader ? (
          <WebViewLogoHeader />
        ) : !inRnWebView ? (
          <Header />
        ) : null}
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
        <Dockbar />
      </main>

      {/* 전역 암정보 가이드 팝업 */}
      <CancerInfoGuide />
    </div>
  );
}
