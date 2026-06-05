import { useEffect, useState } from "react";

interface RotatingTextAdvancedProps {
  texts: string[];
  interval?: number;
  className?: string;
  animationType?: "fade" | "slide-up" | "slide-down" | "scale" | "rotate";
}

export default function RotatingTextAdvanced({
  texts,
  interval = 3000,
  className = "",
  animationType = "fade",
}: RotatingTextAdvancedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (texts.length <= 1) return;

    const timer = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      }, 300);

      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  const getAnimationClasses = () => {
    const baseClasses = "inline-block transition-all duration-500 ease-in-out";

    switch (animationType) {
      case "slide-up":
        return `${baseClasses} ${
          isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`;

      case "slide-down":
        return `${baseClasses} ${
          isAnimating ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
        }`;

      case "scale":
        return `${baseClasses} ${
          isAnimating ? "opacity-0 scale-50" : "opacity-100 scale-100"
        }`;

      case "rotate":
        return `${baseClasses} ${
          isAnimating
            ? "opacity-0 rotate-12 scale-90"
            : "opacity-100 rotate-0 scale-100"
        }`;

      default:
        return `${baseClasses} ${isAnimating ? "opacity-0" : "opacity-100"}`;
    }
  };

  return (
    <div className={`inline-block relative overflow-hidden ${className}`}>
      <span
        className={getAnimationClasses()}
        style={{
          transformOrigin: "center",
        }}
      >
        {texts[currentIndex]}
      </span>
    </div>
  );
}
