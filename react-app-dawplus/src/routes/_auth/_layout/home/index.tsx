import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useCheckAppliedCareTrack } from "@/hooks/queries";
import DailyCarousel from "@/routes/_auth/_layout/home/-components/configured/DailyCarousel";
// Configured (암정보 설정 완료) 컴포넌트
import Header from "@/routes/_auth/_layout/home/-components/configured/Header";
import ScheduleSection from "@/routes/_auth/_layout/home/-components/configured/ScheduleSection";
// 공통 컴포넌트
import HealthCoaching from "@/routes/_auth/_layout/home/-components/HealthCoaching";
import CancerInfoList from "@/routes/_auth/_layout/home/-components/unconfigured/CancerInfoList";
// Unconfigured (암정보 미설정) 컴포넌트
import WelcomeHeader from "@/routes/_auth/_layout/home/-components/unconfigured/WelcomeHeader";
import ConfiguredCancerInfoList from "./-components/configured/ConfiguredCancerInfoList";
import SearchArea from "./-components/SearchArea";

export const Route = createFileRoute("/_auth/_layout/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  // 내정보 - Jotai atom으로 전역 관리
  const accountMe = useAtomValue(accountMeAtom);

  // seq가 존재할 때만 쿼리 실행 (훅 내부에서 자동 처리)
  const { data: isCancerInfoConfigured } = useCheckAppliedCareTrack();

  return (
    <div className="flex flex-1 flex-col relative  bg-gradient-to-b from-gray-50 to-white pb-20">
      {isCancerInfoConfigured ? (
        <>
          {/* 암정보 설정 완료 상태 */}
          <Header userName={accountMe.data?.name ?? ""} />

          <DailyCarousel />
          <ScheduleSection />
          <SearchArea />
          <ConfiguredCancerInfoList />
          <HealthCoaching />
        </>
      ) : (
        <>
          {/* 암정보 미설정 상태 */}
          <WelcomeHeader userName={accountMe.data?.name ?? ""} />
          <ScheduleSection />
          <SearchArea />
          <CancerInfoList />
        </>
      )}
    </div>
  );
}
