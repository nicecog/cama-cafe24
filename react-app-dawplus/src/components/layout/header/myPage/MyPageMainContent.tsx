import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import {
  Activity,
  Bell,
  ChevronRight,
  FileText,
  Plus,
  Shield,
  TabletSmartphone,
  User,
} from "lucide-react";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { Button } from "@/components/ui/Button";
import { useCheckAppliedCareTrack } from "@/hooks/queries";
import CareTrackInfo from "./-components/CareTrackInfo";
import MyHistory from "./-components/MyHistory";

type MyPageMainContentProps = {
  className?: string;
};

/** cama-billive MyPageMainScreen — 메뉴는 전용 URL로 이동 */
export function MyPageMainContent({ className }: MyPageMainContentProps) {
  const navigate = useNavigate();
  const { data: account } = useAtomValue(accountMeAtom);
  const userName = account?.name ?? "";
  const { data: hasGuideSetup } = useCheckAppliedCareTrack();

  const menuItems = [
    {
      icon: User,
      label: "내 상세정보",
      to: "/mypage/user-info" as const,
    },
    {
      icon: Activity,
      label: "걸음수",
      to: "/mypage/steps" as const,
    },
    {
      icon: FileText,
      label: "서비스 이용약관",
      to: "/mypage/terms" as const,
    },
    {
      icon: Shield,
      label: "개인정보 처리방침",
      to: "/mypage/privacy" as const,
    },
    {
      icon: TabletSmartphone,
      label: "의사앱 자료전송",
      to: "/mypage/doctor-transfer" as const,
    },
  ];

  return (
    <div className={className}>
      <section className="px-4 pt-5 pb-4">
        <h2 className="text-xl font-bold text-[#774F2D]">
          {userName}님의 암정보 가이드
        </h2>
        <div className="mt-4">
          {!hasGuideSetup ? (
            <div className="flex flex-col items-center justify-between rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8">
              <p className="text-base text-[#7E7E7E]">
                암정보 가이드를 설정 해주세요.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4 border-[#ED7101] text-[#ED7101]"
                onClick={() => navigate({ to: "/mypage/care-track/apply" })}
              >
                <Plus size={16} className="mr-1" />
                암정보 가이드 설정하기
              </Button>
            </div>
          ) : (
            <CareTrackInfo linkTo="/mypage/care-track" />
          )}
        </div>
      </section>

      <section className="bg-[#F9F9F9] pb-5">
        <h2 className="px-4 pt-5 pb-1.5 text-xl font-bold text-[#774F2D]">
          나의메뉴
        </h2>
        <div className="mt-3 space-y-3 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate({ to: item.to })}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-3 text-left shadow-sm active:bg-gray-50"
              >
                <div className="flex items-center gap-5">
                  <Icon size={28} className="text-[#444]" strokeWidth={1.5} />
                  <span className="text-xl text-[#444444]">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-4 pt-6 pb-2">
        <div className="mb-2 flex items-center gap-2">
          <Bell size={20} className="text-[#774F2D]" />
          <h2 className="text-xl font-bold text-[#774F2D]">최근 알림</h2>
        </div>
        <MyHistory hideTitle />
      </section>

      {/* 하단 Dockbar(fixed h-14)에 가리지 않도록 스크롤 여백 */}
      <div
        aria-hidden
        className="shrink-0 min-h-[4.5rem] h-[calc(env(safe-area-inset-bottom,0px)+3.5rem)]"
      />
    </div>
  );
}
