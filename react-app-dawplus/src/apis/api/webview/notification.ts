import { api } from "../../client";
import type { ApiResponse, WebviewNotification } from "../../types";

/**
 * 최근 알림 조회
 * GET /api/webview/notification/recent
 * @param acSeq - 계정 시퀀스 (optional)
 */
export const getRecentNotifications = async (
  acSeq?: string | number,
): Promise<ApiResponse<WebviewNotification[]>> => {
  const url = acSeq
    ? `api/webview/notification/recent?acSeq=${acSeq}`
    : "api/webview/notification/recent";

  return api.get(url).json();
};
