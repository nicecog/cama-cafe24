import { useQuery } from "@tanstack/react-query";
import {
  checkHospitalService,
  getCommonDiseaseList,
  getHospital,
  getHospitalDiseaseList,
  getHospitalDoctorList,
  getHospitalList,
} from "@/apis/api";
import { queryKeys } from "@/lib/queryClient";

/**
 * 현재 병원 정보 조회
 * GET /api/account/hospital
 */
export const useHospital = () => {
  return useQuery({
    queryKey: queryKeys.hospital.current(),
    queryFn: getHospital,
  });
};

/**
 * 질환 목록 조회 (공통)
 * GET /api/webview/common/disease/list
 * 공통 질환 목록을 조회합니다 (병원 구분 없음)
 */
export const useGetDiseaseList = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.common.diseaseList(),
    queryFn: getCommonDiseaseList,
    enabled: options?.enabled,
  });
};

/**
 * 병원 질병 리스트 조회
 * GET /api/hospital/{hSeq}/disease/list
 * @param hSeq - 병원 seq (1: 중앙대학교병원, 7: 미국병원)
 */
export const useHospitalDiseaseList = (hSeq?: number, enabled?: boolean) => {
  return useQuery({
    queryKey: queryKeys.hospital.diseaseList(hSeq),
    queryFn: () => {
      if (hSeq === undefined) throw new Error("hSeq is required");
      return getHospitalDiseaseList(hSeq);
    },
    enabled: enabled && hSeq !== undefined,
  });
};

/**
 * 병원 의사 리스트 조회
 * GET /api/hospital/{hospitalSeq}/doctor/list
 * @param hospitalSeq - 병원 seq (1: 중앙대학교병원, 7: 미국병원)
 */
export const useHospitalDoctorList = (hospitalSeq: number) => {
  return useQuery({
    queryKey: queryKeys.hospital.doctorList(hospitalSeq),
    queryFn: () => getHospitalDoctorList(hospitalSeq),
  });
};

/**
 * 병원 리스트 조회
 * GET /api/hospital/list
 */
export const useHospitalList = () => {
  return useQuery({
    queryKey: queryKeys.hospital.list(),
    queryFn: getHospitalList,
  });
};

/**
 * 병원 서비스 신청 확인
 * POST /api/hospital/service/check
 * @param seq - 회원 seq
 */
export const useCheckHospitalService = (seq: number) => {
  return useQuery({
    queryKey: queryKeys.hospital.serviceCheck(seq),
    queryFn: () => checkHospitalService(),
  });
};
