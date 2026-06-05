import { api } from "../../client";
import type { ApiResponse, WebviewSchedule } from "../../types";

/**
 * 일정 조회 (일별)
 * GET /api/webview/schedule
 * @param date - 조회할 날짜 (YYYY-MM-DD 형식)
 * @param acSeq - 계정 시퀀스
 */
export const getSchedule = async (
  date: string,
  acSeq: string | number,
): Promise<ApiResponse<WebviewSchedule[]>> => {
  const url = `api/webview/schedule?d=${date}&acSeq=${acSeq}`;
  return api.get(url).json();
};

/**
 * 일정 조회 (월별)
 * GET /api/webview/schedule/monthly
 * @param monthly - 조회할 월 (YYYYMMDD 형식, 해당 월의 모든 일정 반환)
 * @param acSeq - 계정 시퀀스
 */
export const getMonthlySchedule = async (
  monthly: string,
  acSeq: string | number,
): Promise<ApiResponse<WebviewSchedule[]>> => {
  const url = `api/webview/schedule/monthly?monthly=${monthly}&acSeq=${acSeq}`;
  return api.get(url).json();
};
/**
 * 일정 완료 처리
 * POST /api/webview/schedule/{batchSeq}/done/{acSeq}
 */
export const updateScheduleDone = async (
  batchSeq: number | string,
  acSeq: number | string,
): Promise<ApiResponse<null>> => {
  const url = `api/webview/schedule/${batchSeq}/done/${acSeq}`;
  return api.post(url).json();
};

/**
 * 일정 미완료 처리
 * POST /api/webview/schedule/{batchSeq}/unDone/{acSeq}
 */
export const updateScheduleUnDone = async (
  batchSeq: number | string,
  acSeq: number | string,
): Promise<ApiResponse<null>> => {
  const url = `api/webview/schedule/${batchSeq}/unDone/${acSeq}`;
  return api.post(url).json();
};

/**
 * 일정 삭제
 * DELETE /api/webview/schedule/{seq}/view/{acSeq}
 */
export const deleteSchedule = async (
  seq: number | string,
  acSeq: number | string,
): Promise<ApiResponse<null>> => {
  const url = `api/webview/schedule/${seq}/view/${acSeq}`;
  return api.delete(url).json();
};

/**
 * 일정 등록
 * POST /api/webview/schedule
 */
export const createSchedule = async (data: {
  acSeq: string | number;
  scheduleName: string;
  scheduleType: string;
  startDate: string;
  endDate: string;
  time: string;
  days: number[];
  memo: string;
  repeat: boolean;
  alarm: boolean;
}): Promise<ApiResponse<null>> => {
  const url = `api/webview/schedule`;
  return api.post(url, { json: data }).json();
};

/**
 * 일정 수정
 * PUT /api/webview/schedule/{seq}/view
 */
export const updateSchedule = async (
  seq: number | string,
  data: {
    acSeq: string | number;
    scheduleName: string;
    scheduleType: string;
    startDate: string;
    endDate: string;
    time: string;
    days: number[];
    memo: string;
    repeat: boolean;
    alarm: boolean;
  },
): Promise<ApiResponse<null>> => {
  const url = `api/webview/schedule/${seq}/view`;
  return api.put(url, { json: data }).json();
};
