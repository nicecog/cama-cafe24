import { UserRound } from "lucide-react";

export default function Header() {
  return (
    <div className="border border-primary-hover rounded-lg p-4 flex gap-4 items-start bg-white sm:flex-row flex-col ">
      <div className="truncate font-bold whitespace-nowrap w-full block sm:hidden">
        중앙대학교의료원 행정직(계약집)모집_AI 역량검사
      </div>
      <div className="flex item-center gap-5">
        {/* 아이콘 영역 */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-300/10 border border-primary-hover">
          <UserRound />
        </div>
        <div className="sm:hidden">
          <p className="font-bold font-jalnan text-base">P-25-14001234</p>
          <div className="whitespace-nowrap text-gray-700 font-semibold">
            홍길동
          </div>
        </div>
      </div>
      {/* 내용 영역 */}
      <div className="flex-1 flex flex-col justify-center">
        {/* 타이틀 */}
        <p className="hidden sm:block font-bold font-jalnan text-base">
          P-25-14001234
        </p>

        {/* 상세 문구 */}
        <div className="mt-1 flex flex-col md:flex-row flex-wrap sm:gap-2 text-sm">
          <div className="whitespace-nowrap text-gray-700 font-semibold hidden sm:block ">
            홍길동
          </div>

          <div className="whitespace-nowrap truncate">
            직군/직무 : 경영기획/지원/회계/....
          </div>
          <div className="whitespace-nowrap truncate">
            지원분야 : 계약직(신규)...
          </div>
        </div>
      </div>
    </div>
  );
}
