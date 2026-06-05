import { useAtomValue } from "jotai";
import { Bell, Clock } from "lucide-react";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { Each } from "@/components/common/Each";
import { useRecentNotifications } from "@/hooks/queries";

export default function MyHistory() {
  const { data: accountMe } = useAtomValue(accountMeAtom);

  // 최근 알림 조회
  const { data: notifications } = useRecentNotifications(accountMe?.seq);

  // 날짜 포맷 함수 (YYYY-MM-DD HH:mm:ss -> YYYY.MM.DD)
  const formatDate = (dateString: string) => {
    const date = dateString.split(" ")[0]; // "2026-01-11"
    return date.replace(/-/g, "."); // "2026.01.11"
  };

  // 시간 포맷 함수 (YYYY-MM-DD HH:mm:ss -> HH:mm)
  const formatTime = (dateString: string) => {
    const time = dateString.split(" ")[1]; // "15:55:33"
    return time.substring(0, 5); // "15:55"
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <Bell className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-sm font-bold text-gray-900">최근 활동</h2>
        </div>
      </div>

      {/* 알림 리스트 */}
      <div className="space-y-2">
        <Each
          of={notifications?.slice(0, 10)}
          render={(item) => (
            <div
              key={item.seq}
              className="group relative p-3.5 rounded-xl border-primary-light bg-gradient-to-br from-white to-gray-50/50 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              {/* 좌측 인디케이터 */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-start gap-3 pl-1">
                {/* 아이콘 */}
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center mt-0.5 border border-primary/10">
                  <Bell className="w-3.5 h-3.5 text-primary/70" />
                </div>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 leading-relaxed font-medium mb-1.5">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(item.createdAt)}</span>
                    <span className="text-gray-300">•</span>
                    <span>{formatTime(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          noData={
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Bell className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-xs text-gray-400 font-medium mb-1">
                최근 활동이 없습니다
              </p>
              <p className="text-[10px] text-gray-300">
                새로운 알림이 도착하면 여기에 표시됩니다
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}
