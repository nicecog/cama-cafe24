import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { isScrolledAtom } from "@/atoms/scrollAtom";

/**
 * Safari의 노치/상태바 색상을 동적으로 제어하는 컴포넌트
 * 스크롤 상태에 따라 theme-color를 변경하여 헤더와 일치시킵니다.
 */
export default function ThemeColorController() {
  const isScrolled = useAtomValue(isScrolledAtom);

  useEffect(() => {
    // theme-color meta 태그 찾기 또는 생성
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }

    // 스크롤 상태에 따라 색상 변경
    // isScrolled: true -> primary 색상 (#0066CC)
    // isScrolled: false -> 투명 (흰색 배경)
    const color = isScrolled ? "#0066CC" : "#ffffff";
    metaThemeColor.setAttribute("content", color);

    // Cleanup: 컴포넌트 언마운트 시 기본값으로 복원
    return () => {
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", "#ffffff");
      }
    };
  }, [isScrolled]);

  return null; // UI를 렌더링하지 않음
}
