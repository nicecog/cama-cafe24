import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import {
  decreaseFontScaleAtom,
  fontScaleAtom,
  increaseFontScaleAtom,
  normalizeFontScale,
  resetFontScaleAtom,
  updateCSSVariables,
} from "@/atoms/fontSizeAtom";

export const useFontSize = () => {
  const [scale, setScale] = useAtom(fontScaleAtom);
  const increase = useSetAtom(increaseFontScaleAtom);
  const decrease = useSetAtom(decreaseFontScaleAtom);
  const reset = useSetAtom(resetFontScaleAtom);
  const normalizedScale = normalizeFontScale(scale);

  // 초기 CSS 변수 설정
  useEffect(() => {
    if (normalizedScale !== scale) {
      setScale(normalizedScale);
    }
    updateCSSVariables(normalizedScale);
  }, [normalizedScale, scale, setScale]);

  return {
    scale: normalizedScale,
    setScale: (newScale: typeof scale) => {
      const normalized = normalizeFontScale(newScale);
      setScale(normalized);
      updateCSSVariables(normalized);
    },
    increase,
    decrease,
    reset,
  };
};
