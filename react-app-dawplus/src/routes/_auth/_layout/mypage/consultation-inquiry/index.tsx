import { createFileRoute } from "@tanstack/react-router";
import { ConsultationInquiryPage } from "@/components/mypage/ConsultationInquiryPage";

export const Route = createFileRoute(
  "/_auth/_layout/mypage/consultation-inquiry/",
)({
  component: ConsultationInquiryRoute,
});

function ConsultationInquiryRoute() {
  return <ConsultationInquiryPage />;
}
