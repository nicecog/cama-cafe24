import { motion, useInView } from "motion/react";
import { type ReactNode, useRef } from "react";

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  skipAnimation?: boolean; // 애니메이션 스킵 옵션
}

export const FadeInUp = ({
  children,
  delay = 0,
  duration = 0.5,
  distance = 30,
  once = true,
  className = "",
  skipAnimation = false,
}: FadeInUpProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  // skipAnimation이 true면 애니메이션 없이 즉시 표시
  if (skipAnimation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // easeInOut
      }}
      style={{
        // 레이아웃 유지: 요소가 항상 공간을 차지하도록 함
        // display나 visibility를 변경하지 않음
        willChange: "opacity, transform",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
