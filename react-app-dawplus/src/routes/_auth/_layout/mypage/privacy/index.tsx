import { createFileRoute } from "@tanstack/react-router";
import { MypageSubPageLayout } from "@/components/mypage/MypageSubPageLayout";
import { PolicyPageContent } from "@/components/mypage/PolicyPageContent";

export const Route = createFileRoute("/_auth/_layout/mypage/privacy/")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <MypageSubPageLayout title="개인정보 처리방침">
      <PolicyPageContent type="privacy" />
    </MypageSubPageLayout>
  );
}
