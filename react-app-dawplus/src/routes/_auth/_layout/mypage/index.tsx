import { createFileRoute } from "@tanstack/react-router";
import { MyPageMainContent } from "@/components/layout/header/myPage/MyPageMainContent";

/** RN WebView: cama-billive MyPageMainScreen */
export const Route = createFileRoute("/_auth/_layout/mypage/")({
  component: MyPageRoute,
});

function MyPageRoute() {
  return (
    <div className="flex min-h-full flex-col bg-white pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
      <MyPageMainContent className="flex-1" />
    </div>
  );
}
