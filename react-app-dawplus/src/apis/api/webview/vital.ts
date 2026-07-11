import { api } from "../../client";
import type { ApiResponse } from "../../types";

export type VitalTypeCd =
  | "HEART_RATE"
  | "BP_SYSTOLIC"
  | "BP_DIASTOLIC"
  | "SPO2"
  | "BODY_TEMP"
  | "RESPIRATORY_RATE";

export type VitalSourceCd = "MANUAL" | "PHONE" | "WEARABLE";

export interface VitalRecordRequest {
  accountSeq?: number;
  measuredAt?: string;
  vitalTypeCd: VitalTypeCd;
  valueNum: number;
  unit?: string;
  sourceCd?: VitalSourceCd;
  memo?: string;
}

export interface VitalRecordDto extends VitalRecordRequest {
  seq?: number;
}

export interface VitalRecordQuery {
  accountSeq?: number;
  vitalTypeCd?: VitalTypeCd;
  fromDate?: string;
  toDate?: string;
}

/**
 * 심박·생체신호 저장 (WebView)
 * PUT /api/webview/track/service/vital
 */
export const saveWebviewVitalRecord = async (
  params: VitalRecordRequest,
): Promise<ApiResponse<boolean>> => {
  return api
    .put("api/webview/track/service/vital", {
      json: params,
    })
    .json();
};

/**
 * 심박·생체신호 이력 조회 (WebView)
 * POST /api/webview/track/service/vitalList
 */
export const fetchWebviewVitalList = async (
  params: VitalRecordQuery,
): Promise<ApiResponse<VitalRecordDto[]>> => {
  return api
    .post("api/webview/track/service/vitalList", {
      json: params,
    })
    .json();
};

/** 심박수(bpm) 저장 — PHONE 소스 기본 */
export const saveHeartRateRecord = async (
  valueBpm: number,
  options: Omit<VitalRecordRequest, "vitalTypeCd" | "valueNum"> = {},
): Promise<ApiResponse<boolean>> => {
  return saveWebviewVitalRecord({
    vitalTypeCd: "HEART_RATE",
    valueNum: valueBpm,
    unit: "bpm",
    sourceCd: options.sourceCd ?? "PHONE",
    ...options,
  });
};

/**
 * 심박·생체신호 일괄 저장 (WebView)
 * POST /api/webview/track/service/vital/batch
 */
export const saveWebviewVitalBatch = async (
  records: VitalRecordRequest[],
): Promise<ApiResponse<{ saved: number }>> => {
  return api
    .post("api/webview/track/service/vital/batch", {
      json: records,
    })
    .json();
};
