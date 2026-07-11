import { createFileRoute } from "@tanstack/react-router";
import { DoctorTransferPage } from "@/components/mypage/DoctorTransferPage";

export const Route = createFileRoute("/_auth/_layout/mypage/doctor-transfer/")({
  component: DoctorTransferRoute,
});

function DoctorTransferRoute() {
  return <DoctorTransferPage />;
}
