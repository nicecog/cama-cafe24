import { atom } from "jotai";

//  Current Step
export const stepAtom = atom(1);

export const maxStepAtom = atom(7);

// 초기화
export const initAtom = atom(null, (_, set) => {
  set(stepAtom, 1);
});

// 이전 페이지
export const nextStepAtom = atom(null, (get, set) => {
  //  현재 스템
  const current = get(stepAtom);

  const max = get(maxStepAtom);

  if (current < max) {
    set(stepAtom, current + 1);
  }
});

// 다음 페이지
export const prevStepAtom = atom(null, (get, set) => {
  const current = get(stepAtom);
  if (current > 1) {
    set(stepAtom, current - 1);
  }
});
