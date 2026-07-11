import { createFileRoute } from "@tanstack/react-router";
import { MypageSubPageLayout } from "@/components/mypage/MypageSubPageLayout";
import { MyStepsContent } from "@/components/mypage/MyStepsContent";

export const Route = createFileRoute("/_auth/_layout/mypage/steps/")({
  component: StepsPage,
});

function StepsPage() {
  return (
    <MypageSubPageLayout title="걸음수">
      <MyStepsContent />
    </MypageSubPageLayout>
  );
}
