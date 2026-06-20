import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { Building2, Calendar, Phone, User2 } from "lucide-react";
import HeadType5 from "@/assets/images/character/head/type5.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useAuth } from "@/auth";
import Popup from "@/components/ui/Popup";
import { useWithdrawAccount } from "@/hooks/mutations";
import { useDialog } from "@/hooks/useDialog";
import { queryClient } from "@/lib/queryClient";

type MyInfosProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function MyInfos(props: MyInfosProps) {
  // props
  const { open, setOpen } = props;
  //  Confirm
  const { confirm } = useDialog();

  // 내 정보에서 accountSeq 가져오기
  const { data: accountData } = useAtomValue(accountMeAtom);

  // 성별 한글 변환
  const genderText =
    accountData?.gender === "MALE"
      ? "남성"
      : accountData?.gender === "FEMALE"
        ? "여성"
        : accountData?.gender;

  // 정보 항목들
  const infoItems = [
    {
      icon: User2,
      label: "이름",
      value: accountData?.name || "-",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Phone,
      label: "전화번호",
      value: accountData?.phone || "-",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: User2,
      label: "성별",
      value: genderText || "-",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Calendar,
      label: "생년월일",
      value: accountData?.birth || "-",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  //  navi
  const navigate = useNavigate();
  const { logout } = useAuth();

  //  회원 탈퇴
  const { mutate } = useWithdrawAccount();

  // 회원 탈퇴
  const handleWithdrawal = () => {
    // accountData가 없으면 탈퇴 불가 (방어 코드)
    if (!accountData?.loginId) {
      console.error("로그인 정보가 없습니다.");
      return;
    }

    confirm(
      {
        title: "회원 탈퇴",
        body: (
          <div className="space-y-2.5 text-left px-1">
            <p className="text-sm text-gray-700 leading-snug">
              탈퇴 시 아래 정보가{" "}
              <span className="font-semibold text-destructive">
                영구 삭제됩니다.
              </span>
            </p>
            <ul className="space-y-1.5 pl-3 text-sm">
              <li className="flex items-start gap-1.5 text-gray-600">
                <span className="text-destructive text-xs mt-0.5">▪</span>
                <span>계정 정보 및 개인 설정</span>
              </li>
              <li className="flex items-start gap-1.5 text-gray-600">
                <span className="text-destructive text-xs mt-0.5">▪</span>
                <span>진행 중인 암정보 가이드 여정</span>
              </li>
              <li className="flex items-start gap-1.5 text-gray-600">
                <span className="text-destructive text-xs mt-0.5">▪</span>
                <span>저장된 즐겨찾기 및 활동 기록</span>
              </li>
            </ul>
            <p className="text-center font-semibold text-gray-900 pt-1 text-sm">
              정말 탈퇴하시겠습니까?
            </p>
          </div>
        ),
      },
      () => {
        mutate(accountData.loginId, {
          onSuccess: async () => {
            // 탈퇴 완료 후 인증/캐시를 먼저 비워야 로그인 페이지 진입이 막히지 않는다.
            await logout();
            queryClient.clear();
            setOpen(false);
            navigate({ to: "/webview", replace: true });
          },
          onError: (error) => {
            console.error("회원 탈퇴 실패:", error);
          },
        });
      },
    );
  };
  // render
  return (
    <Popup open={open} setOpen={setOpen} title="내정보">
      <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
        {/* 헤더 - 사용자 정보 */}
        <div className="relative   p-4   text-white overflow-hidden flex-shrink-0">
          {/* 프로필 카드 */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6  shadow-lg">
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
                  {accountData?.name || "사용자"} 님
                </h1>
                <p className="text-white/90 text-sm">
                  오늘도 건강한 하루 되세요
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 정보 영역 */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* 개인 정보 섹션 - 심플한 리스트 형태 */}
          <div className="flex-1 px-4 py-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h2 className="text-sm font-bold text-gray-900">개인 정보</h2>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {infoItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.bgColor}`}
                    >
                      <item.icon className={item.color} size={16} />
                    </div>
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-4 text-center underline font-bold text-base-fixed">
            <button onClick={handleWithdrawal}>회원탈퇴</button>
          </div>

          {/* 회사 정보 섹션 - 푸터 스타일 */}
          <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 px-4 py-4 border-t-2 border-gray-200 font-semibold">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="text-gray-600" size={18} />
              <h2 className="text-sm font-bold text-gray-800">회사 정보</h2>
            </div>

            <div className="space-y-2.5">
              {/* 회사명 */}
              <div>
                <h3 className="text-base font-bold text-gray-900">(주) 휴딧</h3>
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-300" />

              {/* 회사 상세 정보 - 인라인 형태로 컴팩트하게 */}
              <div className="space-y-1.5">
                <p className="text-xs text-gray-700">
                  <span className="text-gray-500">대표</span> 한덕현 ·{" "}
                  <span className="text-gray-500">사업자</span> 368-86-03038
                </p>
                <p className="text-xs text-gray-700">
                  <span className="text-gray-500">주소</span> 서울특별시 동작구
                  흑석로 109. 3층
                </p>
                <p className="text-xs text-gray-700">
                  <span className="text-gray-500">대표전화</span> 02-6299-3877
                </p>
              </div>

              {/* 저작권 */}
              <div className="pt-2 border-t border-gray-300">
                <p className="text-[10px] text-gray-400 text-center">
                  © 2026 HUDIT. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
