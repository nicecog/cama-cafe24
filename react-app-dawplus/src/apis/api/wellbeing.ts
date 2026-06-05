import { api } from "../client";
import type {
  ApiResponse,
  WellbeingResourceItem,
  WellbeingResourceListParams,
} from "../types";

/**
 * 웰빙 리소스 리스트 조회
 * POST /api/contents/wellbeing/resources/getWellbeingResourceList
 */
export const fetchWellbeingResourceList = async (
  params: WellbeingResourceListParams,
): Promise<ApiResponse<WellbeingResourceItem[]>> => {
  return api
    .post("api/contents/wellbeing/resources/getWellbeingResourceList", {
      json: params,
    })
    .json();
};
