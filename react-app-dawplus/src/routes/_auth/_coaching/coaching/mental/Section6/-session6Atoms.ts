import { atom } from "jotai";

export const stepAtom = atom(1);
export const maxStepAtom = atom(3);
export const careTypeAtom = atom("");

export const initAtom = atom(null, (_, set) => {
  set(stepAtom, 1);
  set(careTypeAtom, "");
});

export const nextStepAtom = atom(null, (get, set) => {
  const current = get(stepAtom);
  const max = get(maxStepAtom);

  if (current < max) {
    set(stepAtom, current + 1);
  }
});

export const prevStepAtom = atom(null, (get, set) => {
  const current = get(stepAtom);

  if (current > 1) {
    set(stepAtom, current - 1);
  }
});

export const setCareTypeAtom = atom(null, (get, set, value: string) => {
  const current = get(stepAtom);

  set(stepAtom, Math.min(current + 1, get(maxStepAtom)));
  set(careTypeAtom, value);
});
