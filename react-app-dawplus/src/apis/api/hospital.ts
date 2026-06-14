import type { DiseaseListResponse } from "@/apis/types/disease.types";
import type { HospitalListItem } from "@/apis/types/hospital.types";
import { api } from "../client";
import type { ApiResponse } from "../types";

/**
 * 병원 정보 조회
 * GET /api/account/hospital
 */
export const getHospital = async (): Promise<any> => {
  return api.get("api/contents/list?paging=false").json();
};

/**
 * 병원 질병 리스트 조회 -- 변경완료
 * GET /api/hospital/{hSeq}/disease/list
 * @param hSeq - 병원 seq (1: 중앙대학교병원, 7: 미국병원)
 */
export const getHospitalDiseaseList = async (
  hSeq: number,
): Promise<ApiResponse<DiseaseListResponse>> => {
  return api.get(`api/webview/hospital/${hSeq}/disease/list`).json();
};

/**
 * 병원 의사 리스트 조회
 * GET /api/hospital/{hospitalSeq}/doctor/list
 * @param hospitalSeq - 병원 seq (1: 중앙대학교병원, 7: 미국병원)
 */
export const getHospitalDoctorList = async (
  hospitalSeq: number,
): Promise<ApiResponse> => {
  return api.get(`api/hospital/${hospitalSeq}/doctor/list`).json();
};

/**
 * 병원 리스트 조회
 * GET /api/hospital/list
 */
export const getHospitalList = async (): Promise<
  ApiResponse<HospitalListItem[]>
> => {
  return api.get("api/hospital/list").json();
};

/**
 * 병원 서비스 신청
 * POST /api/hospital/service/apply
 * @param hospitalSeq - 병원 seq
 * @param acSeq - 계정 seq
 */
export const applyHospitalService = async (
  hospitalSeq: number,
  acSeq: number,
): Promise<ApiResponse> => {
  return api
    .post("api/hospital/service/apply", {
      json: { hospitalSeq, acSeq },
    })
    .json();
};

/**
 * 병원 서비스 신청 확인 (JWT — cama-plus-app 과 동일)
 * POST /api/hospital/service/check
 */
export const checkHospitalService = async (): Promise<ApiResponse<string>> => {
  return api.post("api/hospital/service/check").json();
};
