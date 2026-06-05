import { useAnimate } from "framer-motion";
import { useEffect } from "react";

function easeInOut(t: number) {
  // 기본 ease-in-out cubic
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export default function IncrementNumber({
  target = 100,
  duration = 2000,
  className = "",
}: {
  target: number;
  duration?: number;
  className?: string;
}) {
  const [scope] = useAnimate();

  useEffect(() => {
    const node = scope.current;
    if (!node) return;

    const startTime = performance.now();
    const step = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      let progress = Math.min(elapsed / duration, 1); // 0~1
      progress = easeInOut(progress);

      const currentValue = Math.floor(progress * target);
      node.textContent = currentValue.toLocaleString();

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        node.textContent = target.toLocaleString(); // 마지막 보정
      }
    };

    requestAnimationFrame(step);

    return () => {}; // cleanup 필요 없음, requestAnimationFrame은 한번만 호출
  }, [target, duration, scope]);

  return <span ref={scope} className={className} />;
}
