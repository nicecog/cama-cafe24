import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";

interface CoachingHeaderProgressProps {
  id: number;
  categoryCd: string;
  image: string;
  progress: number;
  titleKey: string;
  idx: number;
  pt: (key: string, opts?: any) => string;
  msgProgress04: string; // "단계" or similar unit
}

export function CoachingHeaderProgress({
  id,
  image,
  progress,
  titleKey,
  idx,
  pt,
}: CoachingHeaderProgressProps) {
  const isCompleted = progress === 100;

  // 원형 진행바 계산
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: idx * 0.08,
      }}
      className={cn(
        "relative flex flex-col items-center p-2 rounded-xl",
        "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg",
        "transform-gpu",
        isCompleted && "bg-emerald-500/20 border-emerald-400/30",
      )}
      style={{ backfaceVisibility: "hidden" }}
    >
      {/* Circular Progress Area */}
      <div className="relative w-14 h-14 flex items-center justify-center mb-1.5">
        <svg className="absolute -rotate-90 w-full h-full">
          {/* Background Circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="3.5"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            stroke={isCompleted ? "#10b981" : "white"}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: 1.5,
              delay: 0.5 + idx * 0.1,
              ease: "easeOut",
            }}
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
          />
        </svg>

        {/* Category Image */}
        <div className="relative w-8 h-8 z-10">
          <img
            src={image}
            alt={pt(titleKey)}
            className={cn(
              "w-full h-full object-contain transition-transform duration-300",
              progress > 0 && "scale-110",
            )}
          />
        </div>

        {/* Completed Check Overlay */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 shadow-sm z-20"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Info Text */}
      <div className="flex flex-col items-center w-full px-0.5">
        <span className="text-[10px] text-white/70 font-bold mb-0.5 line-clamp-2 h-[24px] leading-[1.1] break-keep w-full text-center flex items-center justify-center">
          {pt(titleKey)}
        </span>
        <div className="flex items-center gap-0.5">
          {isCompleted ? (
            <span className="text-[10px] font-black text-emerald-300">
              완료
            </span>
          ) : (
            <span className="text-[11px] font-black text-white">
              {progress > 0 ? `${progress}%` : "대기"}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
