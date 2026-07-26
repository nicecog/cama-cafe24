import { atom } from "jotai";

/**
 * 암정보 가이드 팝업 열림/닫힘 상태
 */
export const cancerInfoGuideOpenAtom = atom(false);

export const cancerInfoGuideCloseGuardUntilAtom = atom(0);
