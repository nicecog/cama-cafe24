import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type { AuthContext } from "@/auth";
import { Toaster } from "@/components/ui/Toaster";
import { ErrorPageContent } from "./error";

interface MyRouterContext {
  // The ReturnType of your useAuth hook or the value of your AuthContext
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Toaster />
      <Outlet />
      {/* <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} /> */}
    </>
  ),
  // 전역 에러 처리 - 모든 하위 라우트의 에러를 캐치
  errorComponent: () => <ErrorPageContent />,
});
