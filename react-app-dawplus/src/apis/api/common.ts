import { api } from "../client";
import type { ApiResponse } from "../types";

/**
 * 질병 리스트 조회
 * GET /api/common/disease/list
 */
export const getDiseaseList = async (): Promise<ApiResponse> => {
  return api.get("api/webview/common/disease/list").json();
};
