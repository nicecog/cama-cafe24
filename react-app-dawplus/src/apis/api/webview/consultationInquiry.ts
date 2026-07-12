import { api } from "../../client";
import type {
  ApiResponse,
  ConsultationInquiryFormParams,
  WebviewConsultationInquiry,
} from "../../types";

/**
 * 진찰시 문의사항 목록 조회
 * GET /api/webview/consultation-inquiry
 */
export const getConsultationInquiries = async (
  acSeq: string | number,
): Promise<ApiResponse<WebviewConsultationInquiry[]>> => {
  const url = `api/webview/consultation-inquiry?acSeq=${acSeq}`;
  return api.get(url).json();
};

/**
 * 진찰시 문의사항 등록
 * POST /api/webview/consultation-inquiry
 */
export const createConsultationInquiry = async (
  data: ConsultationInquiryFormParams,
): Promise<ApiResponse<WebviewConsultationInquiry>> => {
  return api.post("api/webview/consultation-inquiry", { json: data }).json();
};

/**
 * 진찰시 문의사항 수정
 * PUT /api/webview/consultation-inquiry/{seq}
 */
export const updateConsultationInquiry = async (
  seq: number | string,
  data: ConsultationInquiryFormParams,
): Promise<ApiResponse<WebviewConsultationInquiry>> => {
  return api
    .put(`api/webview/consultation-inquiry/${seq}`, { json: data })
    .json();
};

/**
 * 진찰시 문의사항 삭제
 * DELETE /api/webview/consultation-inquiry/{seq}
 */
export const deleteConsultationInquiry = async (
  seq: number | string,
  acSeq: string | number,
): Promise<ApiResponse<boolean>> => {
  return api
    .delete(`api/webview/consultation-inquiry/${seq}?acSeq=${acSeq}`)
    .json();
};

/**
 * 진찰시 문의사항 전송완료 처리
 * POST /api/webview/consultation-inquiry/transmit
 */
export const markConsultationInquiriesTransmitted = async (data: {
  acSeq: string | number;
  seqs: Array<number | string>;
}): Promise<ApiResponse<number>> => {
  return api
    .post("api/webview/consultation-inquiry/transmit", { json: data })
    .json();
};
