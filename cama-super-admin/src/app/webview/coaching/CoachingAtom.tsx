import { atomWithReset } from "jotai/utils";

export const MissionStartAtom = atomWithReset<boolean>(false);

// 실험실 기능
export const testPageAtom = atomWithReset<boolean>(false);
