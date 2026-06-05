import { motion } from "framer-motion";
import { MoonStar, Sparkles } from "lucide-react";
import { type CSSProperties, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const sleepHours = Array.from({ length: 12 }, (_, i) => String(i + 1));

interface SleepCheckProps {
  sleepTitle: string;
  sleepHint: string;
  ratingTitle: string;
  ratingHint: string;
  sleep: string;
  rating: string;
  onChange: (nextValue: { sleep?: string; rating?: string }) => void;
}

export default function SleepCheck({
  sleepTitle,
  sleepHint,
  ratingTitle,
  ratingHint,
  sleep,
  rating,
  onChange,
}: SleepCheckProps) {
  const numericRating = Number(rating || "0");
  const percentage = numericRating * 10;
  const ratingCardRef = useRef<HTMLDivElement>(null);
  const previousSleepRef = useRef(sleep);

  useEffect(() => {
    if (previousSleepRef.current === sleep) {
      return;
    }

    previousSleepRef.current = sleep;
    window.requestAnimationFrame(() => {
      ratingCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }, [sleep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-5"
    >
      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/30">
        {/* 1. 수면 시간 (컴팩트 그리드) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20"
            >
              <MoonStar className="h-5 w-5" />
            </motion.div>
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-800">
                {sleepTitle}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400">
                {sleepHint}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {sleepHours.map((hour, idx) => (
              <motion.button
                key={hour}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => onChange({ sleep: hour })}
                className={cn(
                  "flex h-11 items-center justify-center rounded-xl text-sm font-black transition-all active:scale-90",
                  sleep === hour
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100",
                )}
              >
                {hour}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <div className="my-6 h-px w-full bg-slate-50" />

        {/* 2. 수면 만족도 (커스텀 점수 슬라이더) */}
        <div ref={ratingCardRef} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20"
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-base font-black tracking-tight text-slate-800">
                {ratingTitle}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400">
                {ratingHint}
              </p>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-primary tabular-nums">
                {numericRating}
              </span>
              <span className="text-[10px] font-bold text-slate-400">점</span>
            </div>
          </div>

          <div className="relative mt-2 px-1 pb-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-tighter mb-4">
              <span>매우 불만족</span>
              <span>매우 만족</span>
            </div>

            <div className="relative flex items-center h-6">
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={numericRating}
                onChange={(e) => onChange({ rating: e.target.value })}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-100 
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:opacity-0 
                           [&::-moz-range-thumb]:opacity-0 [&::-moz-range-thumb]:border-none"
                style={
                  {
                    background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${percentage}%, rgb(241 245 249) ${percentage}%, rgb(241 245 249) 100%)`,
                  } as CSSProperties
                }
              />
              {/* 커스텀 핸들: 정밀한 위치 보정 적용 */}
              <div
                className="pointer-events-none absolute top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center"
                style={{
                  left: `${percentage}%`,
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="h-5 w-5 -ml-2.5 rounded-full border-[3px] border-white bg-primary shadow-xl ring-1 ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
