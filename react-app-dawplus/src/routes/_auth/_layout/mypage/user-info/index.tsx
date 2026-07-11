import { createFileRoute } from "@tanstack/react-router";
import { MypageSubPageLayout } from "@/components/mypage/MypageSubPageLayout";
import { MyInfosContent } from "@/components/mypage/MyInfosContent";

export const Route = createFileRoute("/_auth/_layout/mypage/user-info/")({
  component: UserInfoPage,
});

function UserInfoPage() {
  return (
    <MypageSubPageLayout title="내 상세정보">
      <MyInfosContent />
    </MypageSubPageLayout>
  );
}
