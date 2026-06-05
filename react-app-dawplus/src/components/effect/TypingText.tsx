import { useAnimate } from "framer-motion";
import { useEffect } from "react";

export function TypingText({
  text = "",
  speed = 50,
  className = "",
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [scope] = useAnimate();

  useEffect(() => {
    let i = 0;
    const node = scope.current;
    if (!node) return;

    node.textContent = "";

    const timer = setInterval(() => {
      if (i <= text.length) {
        node.textContent = text.slice(0, i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, scope]);

  return <span ref={scope} className={className} />;
}
