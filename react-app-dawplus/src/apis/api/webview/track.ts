import { api } from "../../client";
import type {
  ApiResponse,
  CareTrackNewDto,
  WebviewCareTrackAppliedInfo,
  WebviewCareTrackDone,
  WebviewContentItem,
  WebviewStepInfo,
  WebviewStepSaveParams,
} from "../../types";

/**
 * 암정보 가이드 여정 신청 확인
 * POST /api/webview/track/service/check
 */
export const checkAppliedCareTrackService = async (
  seq: string,
): Promise<ApiResponse<boolean>> => {
  return api
    .post("api/webview/track/service/check", {
      json: { seq },
    })
    .json();
};

/**
 * 암정보 가이드 여정 신청
 * POST /api/webview/track/service
 */
export const applyCareTrackService = async (
  params: CareTrackNewDto,
): Promise<ApiResponse<boolean>> => {
  return api
    .post("api/webview/track/service", {
      json: params,
    })
    .json();
};

/**
 * 암정보 가이드 여정 취소
 * POST /api/webview/track/service/cancel - 현재 오류
 */
export const cancelCareTrackService = async (params: {
  diseaseSeq: number;
  hospitalSeq: number;
}): Promise<ApiResponse<boolean>> => {
  return api
    .post("api/webview/track/service/cancel", {
      json: params,
    })
    .json();
};

/**
 * 암정보 가이드 여정 정보 조회
 * POST /api/webview/track/service/info
 */
export const fetchCareTrackServiceList = async (params: {
  acSeq?: string | number;
  hospitalSeq?: string | number;
  diseaseSeq?: string | number;
  day?: string | number;
}): Promise<ApiResponse<WebviewContentItem[]>> => {
  return api
    .post("api/webview/track/service/info", {
      json: params,
    })
    .json();
};

/**
 * 암정보 가이드 여정 완료 확인
 * POST /api/webview/track/service/done
 */
export const checkDoneCareTrackService = async (params: {
  acSeq: string;
  hospitalSeq: string;
  diseaseSeq: string;
  day: string;
}): Promise<ApiResponse<WebviewCareTrackDone[]>> => {
  return api
    .post("api/webview/track/service/done", {
      json: params,
    })
    .json();
};

/**
 * 암정보 가이드 여정 신청 정보 조회
 * POST /api/webview/track/service/request/info
 */
export const getCareTrackServiceAppliedInfo = async (
  acSeq: string,
): Promise<ApiResponse<WebviewCareTrackAppliedInfo>> => {
  return api
    .post("api/webview/track/service/request/info", {
      json: { acSeq },
    })
    .json();
};

/**
 * 일자별 걸음 정보 조회
 * POST /api/webview/track/service/stepList
 */
export const fetchCareTrackStepList = async (
  accountSeq: string,
): Promise<ApiResponse<WebviewStepInfo[]>> => {
  return api
    .post("api/webview/track/service/stepList", {
      json: { accountSeq },
    })
    .json();
};

/**
 * 오늘 걸음수 저장 (WebView)
 * PUT /api/webview/track/service/step
 */
export const saveWebviewStep = async (
  params: WebviewStepSaveParams,
): Promise<ApiResponse<boolean>> => {
  return api
    .put("api/webview/track/service/step", {
      json: params,
    })
    .json();
};

/**
 * 진도율 업데이트 (비회원)
 * PUT /api/webview/track/service/guest/progress
 */
export const updateGuestProgress = async (params: {
  contentsSeq: number;
  progress: number;
}): Promise<ApiResponse<boolean>> => {
  return api
    .put("api/webview/track/service/guest/progress", {
      json: params,
    })
    .json();
};

/**
 * 진도율 업데이트 (서비스 전)
 * PUT /api/webview/track/service/off/progress
 */
export const updateOffProgress = async (params: {
  contentsSeq: number;
  progress: number;
}): Promise<ApiResponse<boolean>> => {
  return api
    .put("api/webview/track/service/off/progress", {
      json: params,
    })
    .json();
};

/**
 * 진도율 업데이트
 * PUT /api/webview/track/service/progress
 */
export const updateProgress = async (params: {
  contentsSeq: number;
  progress: number;
  trackServiceSeq: number;
}): Promise<ApiResponse<boolean>> => {
  return api
    .put("api/webview/track/service/progress", {
      json: params,
    })
    .json();
};
