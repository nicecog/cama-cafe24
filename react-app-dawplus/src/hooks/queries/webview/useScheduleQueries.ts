import { useQuery } from "@tanstack/react-query";
import { getMonthlySchedule, getSchedule } from "@/apis/api/webview/schedule";
import { queryKeys } from "@/lib/queryClient";

/**
 * 일정 조회 (일별)
 * @param date - 조회할 날짜 (YYYY-MM-DD 형식)
 * @param acSeq - 계정 시퀀스
 * @param enabled - 쿼리 활성화 여부 (기본값: true)
 */
export const useSchedule = (
  date: string,
  acSeq: string | number,
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.webview.schedule.byDate(date, acSeq),
    queryFn: () => getSchedule(date, acSeq),
    enabled: enabled && !!date && !!acSeq,
    select: (data) => data.response ?? [],
  });
};

/**
 * 일정 조회 (월별)
 * @param monthly - 조회할 월 (YYYYMMDD 형식)
 * @param acSeq - 계정 시퀀스
 * @param enabled - 쿼리 활성화 여부 (기본값: true)
 */
export const useMonthlySchedule = (
  monthly: string,
  acSeq: string | number,
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.webview.schedule.monthly(monthly, acSeq),
    queryFn: () => getMonthlySchedule(monthly, acSeq),
    enabled: enabled && !!monthly && !!acSeq,
    select: (data) => data.response ?? [],
  });
};
