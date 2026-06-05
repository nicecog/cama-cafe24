import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import {
  checkAppliedCareTrackService,
  checkDoneCareTrackService,
  fetchCareTrackServiceList,
  fetchCareTrackStepList,
  getCareTrackServiceAppliedInfo,
} from "@/apis/api/webview/track";
import { accountHospitalAtom, accountMeAtom } from "@/atoms/accountAtoms";
import { queryKeys } from "@/lib/queryClient";

/**
 * 암정보 가이드 여정 신청 확인
 * accountMe.seq를 자동으로 사용
 */
export const useCheckAppliedCareTrack = () => {
  const { data: accountMe } = useAtomValue(accountMeAtom);
  const seq = accountMe?.seq;

  return useQuery({
    queryKey: queryKeys.webview.track.check(seq ? String(seq) : ""),
    queryFn: () => checkAppliedCareTrackService(String(seq)),
    enabled: !!seq,
    select: (data) => data.response ?? false,
  });
};

/**
 * 암정보 가이드 여정 정보 조회
 * @param params - 조회 파라미터 (hospitalSeq, diseaseSeq, day)
 * acSeq는 자동으로 주입됨
 */
export const useCareTrackServiceList = (params: {
  hospitalSeq?: string | number;
  diseaseSeq?: string | number;
  day?: string | number;
}) => {
  const { data: accountMe } = useAtomValue(accountMeAtom);
  const acSeq = accountMe?.seq;
  const { hospitalSeq, diseaseSeq, day } = params;

  return useQuery({
    queryKey: queryKeys.webview.track.serviceList(
      acSeq ? String(acSeq) : "",
      hospitalSeq ? String(hospitalSeq) : "",
      diseaseSeq ? String(diseaseSeq) : "",
      day ? String(day) : "",
    ),
    queryFn: () => fetchCareTrackServiceList({ acSeq, ...params }),
    enabled: !!acSeq && !!hospitalSeq && !!diseaseSeq && !!day,
    select: (data) => data.response ?? [],
  });
};

/**
 * 암정보 가이드 여정 완료 확인
 * @param params - 조회 파라미터 (hospitalSeq, diseaseSeq, day)
 * @param enabled - 쿼리 활성화 여부
 * acSeq는 자동으로 주입됨
 */
export const useCheckDoneCareTrack = (
  params: {
    diseaseSeq: string;
    day: string;
  },
  enabled = true,
) => {
  const { data: accountMe } = useAtomValue(accountMeAtom);

  const { data: hospitalData } = useAtomValue(accountHospitalAtom);

  const acSeq = accountMe?.seq ? String(accountMe.seq) : "";
  const hospitalSeq = hospitalData?.hospitalSeq
    ? String(hospitalData.hospitalSeq)
    : "";
  const { diseaseSeq, day } = params;

  return useQuery({
    queryKey: queryKeys.webview.track.done(acSeq, hospitalSeq, diseaseSeq, day),
    queryFn: () =>
      checkDoneCareTrackService({
        acSeq,
        day,
        diseaseSeq,
        hospitalSeq,
      }),
    enabled: enabled && !!acSeq && !!hospitalSeq && !!diseaseSeq && !!day,
  });
};

/**
 * 암정보 가이드 여정 신청 정보 조회
 * accountMe.seq를 자동으로 사용
 */
export const useCareTrackAppliedInfo = () => {
  const { data: accountMe } = useAtomValue(accountMeAtom);
  const acSeq = accountMe?.seq;

  return useQuery({
    queryKey: queryKeys.webview.track.appliedInfo(acSeq ? String(acSeq) : ""),
    queryFn: () => getCareTrackServiceAppliedInfo(String(acSeq)),
    enabled: !!acSeq,
    select: (data) => data.response,
  });
};

/**
 * 일자별 걸음 정보 조회
 * @param accountSeq - 계정 시퀀스
 * @param enabled - 쿼리 활성화 여부
 */
export const useCareTrackStepList = (accountSeq: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.webview.track.stepList(accountSeq),
    queryFn: () => fetchCareTrackStepList(accountSeq),
    enabled: enabled && !!accountSeq,
    select: (data) => data.response,
  });
};
