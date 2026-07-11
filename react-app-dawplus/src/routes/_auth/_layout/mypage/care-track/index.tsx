import { createFileRoute } from "@tanstack/react-router";
import CareTrackInfo from "@/components/layout/header/myPage/-components/CareTrackInfo";
import { MypageSubPageLayout } from "@/components/mypage/MypageSubPageLayout";

export const Route = createFileRoute("/_auth/_layout/mypage/care-track/")({
  component: CareTrackPage,
});

function CareTrackPage() {
  return (
    <MypageSubPageLayout title="암정보 가이드">
      <div className="p-4">
        <CareTrackInfo pageMode />
      </div>
    </MypageSubPageLayout>
  );
}
