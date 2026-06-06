import { atom } from "jotai";

export const fontSizeAtom = atom(16);

export const textSmAtom = atom((get) => `${get(fontSizeAtom) - 2}px`);
export const textLgAtom = atom((get) => `${get(fontSizeAtom) + 2}px`); // 18
export const textXlAtom = atom((get) => `${get(fontSizeAtom) + 4}px`); //20
export const text2XlAtom = atom((get) => `${get(fontSizeAtom) + 6}px`); //22
