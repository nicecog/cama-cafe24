import { atom } from "jotai";

//  Current Step
export const stepAtom = atom(1);
// 서브
export const subStepAtom = atom(1);
// 명상 예/아니요
export const checkAtom = atom<boolean | null>(null);

export const initAtom = atom(null, (_, set) => {
  set(checkAtom, null);
  set(stepAtom, 1);
  set(subStepAtom, 1);
});

// 예 선택
export const onCheckAtom = atom(null, (_, set, update: boolean) => {
  set(checkAtom, update);
  set(stepAtom, 2);
});

// 서브 이전 페이지
export const nextSubStepAtom = atom(null, (get, set) => {
  //  현재 스템
  const current = get(subStepAtom);

  if (current < 4) {
    set(subStepAtom, current + 1);
  }
});

// 서브 다음 페이지
export const prevSubStepAtom = atom(null, (get, set) => {
  const current = get(subStepAtom);
  if (current > 1) {
    set(subStepAtom, current - 1);
  }
});
