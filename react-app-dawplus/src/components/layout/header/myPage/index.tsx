import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Activity, Bell, FileText, LogOut, Plus, QrCode, Shield, User } from "lucide-react";
import { useState } from "react";
import activity from "@/assets/images/character/activity.png";
import HeadType5 from "@/assets/images/character/head/type5.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { MyPageAtom } from "@/atoms/CommonAtoms";
import { cancerInfoGuideOpenAtom } from "@/atoms/cancerInfoGuideAtom";
import { Button } from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import { useLogout } from "@/hooks/mutations/useAuthMutations";
import { useDialog } from "@/hooks/useDialog";
import { useCheckAppliedCareTrack } from "@/hooks/queries";
import { cn } from "@/lib/utils";
import MyInfos from "../MyInfos";
import MySteps from "../MySteps";
import PolicyView from "../PolicyView";
import CareTrackInfo from "./-components/CareTrackInfo";
import MyHistory from "./-components/MyHistory";
import MyQrcode from "./-components/-MyQrcode";

const menuItems = [
  {
    icon: User,
    label: "내 상세 정보",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Activity,
    label: "걸음수",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: FileText,
    label: "서비스 이용약관",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: Shield,
    label: "개인정보 처리방침",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

export default function MyPage() {
  //  open
  const [open, setOpen] = useAtom(MyPageAtom);
  const { confirm } = useDialog();
  const logoutMutation = useLogout();

  // 내정보 - Jotai atom으로 전역 관리
  const { data } = useAtomValue(accountMeAtom);

  // 임시 데이터
  const userName = data?.name ?? "";

  //
  const { data: hasGuideSetup } = useCheckAppliedCareTrack();

  //  MyStep
  const [mySteps, setMySteps] = useState(false);
  // my Infos
  const [myInfos, setMyinfos] = useState(false);

  // PolicyView
  const [policyView, setPolicyView] = useState<{
    open: boolean;
    type: "" | "terms" | "privacy";
  }>({
    open: false,
    type: "",
  });

  // QR Code Popup
  const [qrPopupOpen, setQrPopupOpen] = useState(false);

  const onClickHandler = (index: number) => {
    if (index === 0) {
      setMyinfos(true);
    }
    if (index === 1) {
      setMySteps(true);
    }
    if (index === 2) {
      setPolicyView({
        open: true,
        type: "terms",
      });
    }
    if (index === 3) {
      setPolicyView({
        open: true,
        type: "privacy",
      });
    }
  };

  // 암정보 가이드 열기
  const setCancerInfoGuideOpen = useSetAtom(cancerInfoGuideOpenAtom);

  const onLogout = () => {
    confirm(
      {
        title: "로그아웃",
        body: "로그아웃 하시겠습니까?",
        actionButton: "로그아웃",
      },
      () => {
        setOpen(false);
        logoutMutation.mutate();
      },
    );
  };

  return (
    <>
      {/* 내걸음 */}
      <MySteps open={mySteps} setOpen={setMySteps} />
      {/*내정보 */}
      <MyInfos open={myInfos} setOpen={setMyinfos} />
      {/* PolicyView */}
      <PolicyView
        open={policyView.open}
        setOpen={(open: boolean) =>
          setPolicyView((prev) => ({ ...prev, open }))
        }
        type={policyView.type}
      />

      {/* 나의 QR 코드 팝업 */}
      <MyQrcode open={qrPopupOpen} setOpen={setQrPopupOpen} />

      <Popup open={open} setOpen={setOpen} direction="right" title="내정보">
        {/* 전체 스크롤 가능하도록 변경 - 스크롤바 숨김 */}
        <div className="flex flex-col h-full overflow-y-auto bg-gradient-to-b from-gray-50 to-white hide-scrollbar">
          {/* 상단 프로필 영역 - 깔끔한 디자인 */}
          <div className="relative bg-white px-4 pt-4 pb-4 flex-shrink-0">
            {/* 컨텐츠 */}
            <div className="relative z-10">
              {/* 프로필 카드 */}
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 mb-4 shadow-lg">
                {/* 프로필 정보 */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full flex-center border-2 border-white/40 shadow-lg overflow-hidden bg-white flex-shrink-0">
                    <img
                      src={HeadType5}
                      alt="프로필"
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/80 text-xs mb-0.5">안녕하세요</p>
                    <h1 className="text-white text-xl font-bold mb-0.5">
                      {userName} 님
                    </h1>
                    <p className="text-white/90 text-sm">
                      오늘도 건강한 하루 되세요
                    </p>
                  </div>
                </div>
              </div>

              {/* 암정보 가이드 설정 카드 - Primary 색상 */}
              {!hasGuideSetup ? (
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border-2 border-primary/20 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex-center shadow-md">
                      <Bell className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">
                        암정보 가이드 미설정
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        맞춤형 암정보를 받아보세요
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setCancerInfoGuideOpen(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    size="sm"
                  >
                    <Plus size={16} className="mr-2" />
                    지금 설정하기
                  </Button>
                </div>
              ) : (
                <CareTrackInfo />
              )}
            </div>
          </div>

          {/* 메뉴 영역 - 컴팩트하고 잘 보이게 */}
          <div className="px-4 py-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <h2 className="text-sm font-bold text-gray-900">내 활동</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {menuItems.map((item, index) => (
                <button
                  type="button"
                  key={index}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200",
                    "border-2 border-gray-100 hover:border-primary/30",
                    "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                    "bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50",
                  )}
                  onClick={() => onClickHandler(index)}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex-center transition-all shadow-sm",
                      item.bgColor,
                    )}
                  >
                    {index === 0 ? (
                      <img
                        src={HeadType5}
                        alt="프로필"
                        className="w-10 h-10 object-contain"
                      />
                    ) : index === 1 ? (
                      <img
                        src={activity}
                        alt="활동"
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <item.icon className={cn(item.color)} size={24} />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
                    {item.label}
                  </span>
                </button>
              ))}
              <button
                type="button"
                className="col-span-2 mt-3 w-full bg-white border-2 border-gray-100 hover:border-primary/30 text-gray-800 shadow-sm hover:shadow-md hover:bg-gray-50/50 transition-all duration-200 rounded-xl p-4 flex items-center justify-between group active:scale-[0.99]"
                onClick={() => setQrPopupOpen(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-xl text-primary transition-transform group-hover:scale-105 group-hover:bg-primary/15">
                    <QrCode size={22} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">나의 QR 코드 보기</span>
                    <span className="text-xs text-gray-500 font-medium mt-0.5">내 QR코드를 확인해보세요</span>
                  </div>
                </div>
                <div className="w-8 h-8 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                  <span className="text-xl leading-none transition-transform group-hover:translate-x-0.5">›</span>
                </div>
              </button>
            </div>
          </div>

          {/* 활동 로그 영역 - 작고 컴팩트하게 */}
          <div className="px-4 pb-6">
            <button
              type="button"
              onClick={onLogout}
              disabled={logoutMutation.isPending}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-base font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              <LogOut size={18} />
              {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
            </button>
            <MyHistory />
          </div>
        </div>
      </Popup>
    </>
  );
}
