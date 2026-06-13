import { atom } from "jotai";

export const careCardStepAtom = atom(1);
export const careCardMaxStepAtom = atom(1);

export const initCareCardAtom = atom(null, (_, set) => {
  set(careCardStepAtom, 1);
});

export const nextCareCardStepAtom = atom(null, (get, set) => {
  const current = get(careCardStepAtom);
  const max = get(careCardMaxStepAtom);

  if (current < max) {
    set(careCardStepAtom, current + 1);
  }
});

export const prevCareCardStepAtom = atom(null, (get, set) => {
  const current = get(careCardStepAtom);

  if (current > 1) {
    set(careCardStepAtom, current - 1);
  }
});
