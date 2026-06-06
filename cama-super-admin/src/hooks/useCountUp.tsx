import  { useState, useEffect } from 'react';
// Ease Out
function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}


/**
 * Count Animation 효과 
 * @param {number} start 시작 Number
 * @param {number} end 종료 Number
 * @param {number} duration 지속시간
 * @returns 순차적 증가 숫자 
 */
const useCountUp = (start: number, end: number, duration: number): number => {
  // State
  const [count, setCount] = useState<number>(start);

  // Component Did Mount
  useEffect(() => {

    let startTime: number;
    let animationFrameId: number;

    const animate = (time: number) => {
      if (!startTime) {
        startTime = time;
      }

      const progress = Math.min(1, (time - startTime) / duration);
      const easedProgress = easeOutQuart(progress);

      setCount(Math.round(start + (end - start) * easedProgress));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  } ,[start, duration, end]);

  return count;
};

export default useCountUp;
