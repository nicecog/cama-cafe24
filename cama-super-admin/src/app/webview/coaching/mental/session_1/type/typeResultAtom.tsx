import { atom } from "jotai";

//  Current Step
export const stepCdAtom = atom(1);

// 초기화
export const initAtom = atom(null, (_, set) => {
  set(stepCdAtom, 1);
});

// 이전 페이지
export const nextStepCdAtom = atom(null, (get, set) => {
  const current = get(stepCdAtom);

  if (current < 5) {
    set(stepCdAtom, current + 1);
  }
});

// 다음 페이지
export const prevStepCdAtom = atom(null, (get, set) => {
  const current = get(stepCdAtom);

  if (current > 1) {
    set(stepCdAtom, current - 1);
  }
});
