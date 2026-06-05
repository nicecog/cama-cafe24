import { useQuery } from "@tanstack/react-query";
import { getRecentNotifications } from "@/apis/api/webview/notification";
import { queryKeys } from "@/lib/queryClient";

/**
 * 최근 알림 조회
 * @param acSeq - 계정 시퀀스 (optional)
 * @param enabled - 쿼리 활성화 여부 (기본값: true)
 */
export const useRecentNotifications = (acSeq?: string | number) => {
  return useQuery({
    queryKey: queryKeys.webview.notification.recent(acSeq),
    queryFn: () => getRecentNotifications(acSeq),
    enabled: !!acSeq,
    select: (data) => data.response ?? [],
  });
};
