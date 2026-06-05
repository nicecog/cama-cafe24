import { atom } from "jotai";

// 암정보가이드 세팅여부
export const cancerInfoConfigured = atom<boolean>(false);

// 암정보검색 파라미터 (입력용)
export const searchContentParmasAtom = atom({
  searchText: "",
  diseaseSeq: "99", // 초기값: 전체
});

// 실제 실행된 검색 파라미터 (검색 버튼 클릭 시에만 업데이트)
export const executedSearchParamsAtom = atom({
  searchText: "",
  diseaseSeq: "99", // 초기값: 전체
});

// 선택된 일차 (DailyCarousel에서 선택, ConfiguredCancerInfoList에서 사용)
// undefined: 선택 안 함 (현재 일차 사용), number: 특정 일차 선택
export const selectedDayAtom = atom<number | undefined>(undefined);
