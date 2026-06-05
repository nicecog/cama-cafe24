import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { isScrolledAtom } from "@/atoms/scrollAtom";
import { CoachingLayoutHeader } from "@/components/coaching/layout/CoachingHeader";
import ThemeColorController from "@/components/ThemeColorController";
export const Route = createFileRoute("/_auth/_coaching")({
  component: SimpleLayoutComponent,
});

function SimpleLayoutComponent() {
  const setIsScrolled = useSetAtom(isScrolledAtom);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // /coaching/sleep/dayX 경로면 뒤로가기 → /coaching/sleep
  const isSleepDayRoute = /^\/coaching\/sleep\/.+/.test(pathname);
  const handleBack = isSleepDayRoute
    ? () => navigate({ to: "/coaching/sleep" })
    : undefined;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 10);
  };

  return (
    <div className="w-dvw h-dvh flex justify-center overflow-hidden bg-white">
      {/* Safari 노치/상태바 색상 동적 제어 */}
      <ThemeColorController />
      {/* Main Content */}
      <main className="flex flex-col flex-1 min-w-0 h-full relative">
        {/* 리팩토링된 프리미엄 헤더 */}
        <CoachingLayoutHeader onBackClick={handleBack} />

        <div
          id={import.meta.env.VITE_MAIN_SCROLL_CONTAINER_ID}
          onScroll={handleScroll}
          className="flex-1 flex flex-col overflow-auto hide-scrollbar min-w-0 text-slate-800 "
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
            overflowAnchor: "none",
            overscrollBehaviorY: "none",
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
