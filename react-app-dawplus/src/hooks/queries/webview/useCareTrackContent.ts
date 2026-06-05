import { differenceInDays } from "date-fns";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { accountHospitalAtom } from "@/atoms/accountAtoms";
import {
  useCareTrackAppliedInfo,
  useCareTrackServiceList,
  useCheckAppliedCareTrack,
} from "@/hooks/queries";

/**
 * 여정 시작일로부터 현재 일차 계산 (date-fns 사용)
 * @param startDate - 시작 날짜 (YYYY-MM-DD 형식)
 * @param targetDate - 목표 날짜 (YYYY-MM-DD 형식, 기본값: 오늘)
 * @returns 현재 일차 (1일차부터 시작)
 */
const getTargetDays = (startDate: string, targetDate?: string): string => {
  if (!startDate) return "0";

  const start = new Date(startDate);
  const target = targetDate ? new Date(targetDate) : new Date();

  // date-fns의 differenceInDays를 사용하여 날짜 차이 계산
  const daysDiff = differenceInDays(target, start);

  return `${daysDiff + 1}`; // 당일을 1일차로 치기 때문에 +1
};

/**
 * 암정보 가이드 여정 컨텐츠 조회 통합 훅
 *
 * 3단계부터 6단계까지의 API 호출을 하나로 묶은 커스텀 훅
 * accountMe와 hospitalInfo를 자동으로 가져와 사용
 *
 * @param selectedDay - 사용자가 선택한 일차 (옵셔널, 선택하지 않으면 currentDay 사용)
 * @returns {
 *   hasGuideSetup: boolean - 서비스 신청 여부
 *   appliedInfo: 신청 정보 상세
 *   currentDay: string - 현재 여정 일차
 *   trackServiceList: 여정 컨텐츠 리스트
 *   isLoading: boolean - 로딩 상태
 * }
 *
 * @example
 * ```tsx
 * // 오늘 일차의 컨텐츠 조회
 * const { hasGuideSetup, trackServiceList, currentDay } = useCareTrackContent();
 *
 * // 특정 일차의 컨텐츠 조회 (예: 5일차)
 * const { trackServiceList } = useCareTrackContent(5);
 * ```
 */
export const useCareTrackContent = (selectedDay?: number | string) => {
  // hospitalInfo 자동 주입
  const { data: hospitalInfo } = useAtomValue(accountHospitalAtom);

  const hospitalSeq = hospitalInfo?.hospitalSeq;

  // 3단계: 서비스 신청 여부 확인
  const {
    data: hasGuideSetup,
    isLoading: isCheckingGuide,
    isError: isCheckError,
  } = useCheckAppliedCareTrack();

  // 4단계: 서비스 신청 정보 상세 조회
  const {
    data: appliedInfo,
    isLoading: isLoadingAppliedInfo,
    isError: isAppliedInfoError,
  } = useCareTrackAppliedInfo();

  // 5단계: 현재 일차 계산
  const currentDay = useMemo(() => {
    if (!appliedInfo?.trackCreatedAt) return undefined;
    return getTargetDays(appliedInfo.trackCreatedAt);
  }, [appliedInfo?.trackCreatedAt]);

  // 선택한 날짜가 있으면 그것을 사용, 없으면 currentDay 사용
  const targetDay =
    selectedDay !== undefined ? String(selectedDay) : currentDay;

  // 6단계: 최종 컨텐츠 리스트 조회
  const {
    data: trackServiceList,
    isLoading: isLoadingTrackList,
    isError: isTrackListError,
  } = useCareTrackServiceList({
    hospitalSeq,
    diseaseSeq: appliedInfo?.diseaseSeq,
    day: targetDay,
  });

  // 전체 로딩 상태
  const isLoading =
    isCheckingGuide || isLoadingAppliedInfo || isLoadingTrackList;

  // 전체 에러 상태
  const isError = isCheckError || isAppliedInfoError || isTrackListError;

  return {
    // 3단계 결과
    hasGuideSetup,
    // 4단계 결과
    appliedInfo,
    // 5단계 결과
    currentDay,
    // 6단계 결과
    trackServiceList,
    // 상태
    isLoading,
    isError,
  };
};
