import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type FontScale = "small" | "medium" | "large" | "xlarge" | "xxlarge";

// localStorage와 동기화되는 atom
export const fontScaleAtom = atomWithStorage<FontScale>("fontScale", "medium");

// 각 스케일에 대한 CSS 변수 값 (rem 단위)
const SCALE_VALUES: Record<FontScale, Record<string, string>> = {
  small: {
    "--font-xs": "0.625rem", // 10px
    "--font-sm": "0.75rem", // 12px
    "--font-base": "0.875rem", // 14px
    "--font-lg": "1rem", // 16px
    "--font-xl": "1.125rem", // 18px
    "--font-2xl": "1.25rem", // 20px
    "--font-3xl": "1.5rem", // 24px
    "--font-4xl": "1.875rem", // 30px
    "--font-5xl": "2.25rem", // 36px
  },
  medium: {
    "--font-xs": "0.75rem", // 12px
    "--font-sm": "0.875rem", // 14px
    "--font-base": "1rem", // 16px (기본)
    "--font-lg": "1.125rem", // 18px
    "--font-xl": "1.25rem", // 20px
    "--font-2xl": "1.5rem", // 24px
    "--font-3xl": "1.875rem", // 30px
    "--font-4xl": "2.25rem", // 36px
    "--font-5xl": "3rem", // 48px
  },
  large: {
    "--font-xs": "0.875rem", // 14px
    "--font-sm": "1rem", // 16px
    "--font-base": "1.125rem", // 18px
    "--font-lg": "1.25rem", // 20px
    "--font-xl": "1.5rem", // 24px
    "--font-2xl": "1.875rem", // 30px
    "--font-3xl": "2.25rem", // 36px
    "--font-4xl": "2.75rem", // 44px
    "--font-5xl": "3.5rem", // 56px
  },
  xlarge: {
    "--font-xs": "1rem", // 16px
    "--font-sm": "1.125rem", // 18px
    "--font-base": "1.25rem", // 20px
    "--font-lg": "1.5rem", // 24px
    "--font-xl": "1.75rem", // 28px
    "--font-2xl": "2.25rem", // 36px
    "--font-3xl": "2.75rem", // 44px
    "--font-4xl": "3.25rem", // 52px
    "--font-5xl": "4rem", // 64px
  },
  xxlarge: {
    "--font-xs": "1.125rem", // 18px
    "--font-sm": "1.25rem", // 20px
    "--font-base": "1.5rem", // 24px
    "--font-lg": "1.75rem", // 28px
    "--font-xl": "2rem", // 32px
    "--font-2xl": "2.5rem", // 40px
    "--font-3xl": "3rem", // 48px
    "--font-4xl": "3.75rem", // 60px
    "--font-5xl": "4.5rem", // 72px
  },
};

const FONT_SCALES: FontScale[] = [
  "small",
  "medium",
  "large",
  "xlarge",
  "xxlarge",
];

// CSS 변수를 업데이트하는 함수
export const updateCSSVariables = (scale: FontScale) => {
  const root = document.documentElement;
  const values = SCALE_VALUES[scale];

  Object.entries(values).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

// 증가 atom (derived atom)
export const increaseFontScaleAtom = atom(null, (get, set) => {
  const currentScale = get(fontScaleAtom);
  const currentIndex = FONT_SCALES.indexOf(currentScale);
  if (currentIndex < FONT_SCALES.length - 1) {
    const newScale = FONT_SCALES[currentIndex + 1];
    set(fontScaleAtom, newScale);
    updateCSSVariables(newScale);
  }
});

// 감소 atom (derived atom)
export const decreaseFontScaleAtom = atom(null, (get, set) => {
  const currentScale = get(fontScaleAtom);
  const currentIndex = FONT_SCALES.indexOf(currentScale);
  if (currentIndex > 0) {
    const newScale = FONT_SCALES[currentIndex - 1];
    set(fontScaleAtom, newScale);
    updateCSSVariables(newScale);
  }
});

// 리셋 atom (derived atom)
export const resetFontScaleAtom = atom(null, (_get, set) => {
  set(fontScaleAtom, "medium");
  updateCSSVariables("medium");
});
