import { createFileRoute, useNavigate } from "@tanstack/react-router";
import CancerInfoGuide from "@/components/CancerInfoGuide";
import { MypageSubPageLayout } from "@/components/mypage/MypageSubPageLayout";

export const Route = createFileRoute("/_auth/_layout/mypage/care-track/apply/")({
  component: CareTrackApplyPage,
});

function CareTrackApplyPage() {
  const navigate = useNavigate();

  return (
    <MypageSubPageLayout title="암정보 가이드 설정">
      <CancerInfoGuide
        asPage
        onPageClose={() => navigate({ to: "/mypage" })}
      />
    </MypageSubPageLayout>
  );
}
