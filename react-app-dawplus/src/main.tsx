import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/assets/global.css";

// Agentation
import { type AuthContext, AuthProvider, useAuth } from "./auth.tsx";

import Loader from "./components/layout/loader/Loader.tsx";

import { AlertDialogProvider } from "./lib/AlertDialogProvider.tsx";
import RQProvider from "./lib/RQProvider.tsx";
import NotFound from "./NotFound.tsx";
// 생성된 경로 트리 가져오기
import { routeTree } from "./routeTree.gen";

// i18n 설정 (앱 초기화 전에 로드)
import "./i18n";

// 개발 환경 토큰 유틸리티 (개발 환경에서만)
if (import.meta.env.DEV) {
  import("./lib/devTokenUtils").then(({ initDevEnvironment }) => {
    initDevEnvironment();
  });
}

// 새 라우터 인스턴스 만들기
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  // scrollRestoration: true,
  // scrollToTopSelectors: [`#${import.meta.env.VITE_MAIN_SCROLL_CONTAINER_ID}`],
  // getScrollRestorationKey: (location) => location.pathname,
  defaultNotFoundComponent: () => <NotFound />, // 실제 404 페이지 적용
  context: {
    auth: undefined as unknown as AuthContext,
  },
});

// 유형 안전성을 위해 라우터 인스턴스 등록
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

// Render the app
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Root element not found. Make sure your HTML has a <div id='root'></div>",
  );
}
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <RQProvider>
        <AuthProvider>
          <AlertDialogProvider>
            <Loader />

            <InnerApp />
          </AlertDialogProvider>
        </AuthProvider>
      </RQProvider>
    </StrictMode>,
  );
}
