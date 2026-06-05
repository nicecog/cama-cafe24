import { useEffect, useState } from "react";

interface RotatingTextProps {
  texts: string[];
  interval?: number; // 밀리초 단위 (기본: 3000ms)
  className?: string;
}

export default function RotatingText({
  texts,
  interval = 3000,
  className = "",
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (texts.length <= 1) return;

    const timer = setInterval(() => {
      setIsAnimating(true);

      // 애니메이션 중간에 텍스트 변경
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      }, 300); // 페이드 아웃 시간의 절반

      // 애니메이션 완료
      setTimeout(() => {
        setIsAnimating(false);
      }, 600); // 전체 애니메이션 시간
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className={`inline-block relative ${className}`}>
      <span
        className={`inline-block transition-all duration-300 ${
          isAnimating
            ? "opacity-0 -translate-y-2 scale-95"
            : "opacity-100 translate-y-0 scale-100"
        }`}
        style={{
          transformOrigin: "center",
        }}
      >
        {texts[currentIndex]}
      </span>
    </div>
  );
}
