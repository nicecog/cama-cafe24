import { createFileRoute } from "@tanstack/react-router";
import { MypageSubPageLayout } from "@/components/mypage/MypageSubPageLayout";
import { PolicyPageContent } from "@/components/mypage/PolicyPageContent";

export const Route = createFileRoute("/_auth/_layout/mypage/terms/")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <MypageSubPageLayout title="서비스 이용약관">
      <PolicyPageContent type="terms" />
    </MypageSubPageLayout>
  );
}
