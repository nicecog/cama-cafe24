import { useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * useTypingEffect Hook
 *
 * @param text - 타이핑 효과를 적용할 텍스트
 * @param startDelay - 애니메이션 시작 지연 시간 (기본값: 0)
 * @param charDuration - 각 문자별 애니메이션 지속 시간 (기본값: 0.05)
 * @returns 애니메이션이 적용된 ReactNode 배열
 */
function useTypingEffect(
  text: string,
  startDelay: number = 0,
  charDuration: number = 0.05
): ReactNode[] {
  const [elements, setElements] = useState<ReactNode[]>([]);

  useEffect(() => {
    // text.split(""): 글자를 개별 문자로 분리
    const chars = text.split("").map((char, index) => {
      if (char === "\n") {
        // '\n' 문자를 만나면 줄바꿈(<br>) 반환
        return <br key={index} />;
      }
      return (
        <motion.span
          initial={{ opacity: 0 }} // 초기 상태: 투명
          animate={{ opacity: 1 }} // 애니메이션 상태: 불투명
          transition={{
            duration: charDuration, // 애니메이션 지속 시간
            delay: startDelay + index * charDuration, // 애니메이션 지연 시간
          }}
          key={index}
        >
          {char}
        </motion.span>
      );
    });
    // 애니메이션이 적용된 문자 배열 설정
    setElements(chars);
  }, [text, startDelay, charDuration]);

  return elements;
}

export default useTypingEffect;
