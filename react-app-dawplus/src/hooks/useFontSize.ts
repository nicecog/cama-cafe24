import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import {
  decreaseFontScaleAtom,
  fontScaleAtom,
  increaseFontScaleAtom,
  resetFontScaleAtom,
  updateCSSVariables,
} from "@/atoms/fontSizeAtom";

export const useFontSize = () => {
  const [scale, setScale] = useAtom(fontScaleAtom);
  const increase = useSetAtom(increaseFontScaleAtom);
  const decrease = useSetAtom(decreaseFontScaleAtom);
  const reset = useSetAtom(resetFontScaleAtom);

  // 초기 CSS 변수 설정
  useEffect(() => {
    updateCSSVariables(scale);
  }, [scale]);

  return {
    scale,
    setScale: (newScale: typeof scale) => {
      setScale(newScale);
      updateCSSVariables(newScale);
    },
    increase,
    decrease,
    reset,
  };
};
