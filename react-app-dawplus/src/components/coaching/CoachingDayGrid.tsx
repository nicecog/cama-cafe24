import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { COACHING_DATA, type CoachingType } from "./coachingData";

interface CoachingDayGridProps {
  type: CoachingType;
  currentDay: number;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  className?: string;
}

export function CoachingDayGrid({
  type,
  currentDay,
  activeIndex,
  onActiveIndexChange,
  className,
}: CoachingDayGridProps) {
  const content = COACHING_DATA[type];
  const totalDays = content.missions.length;
  const dayStart = content.dayStart ?? 1;

  return (
    <div className={cn("min-h-0 flex-1 bg-white px-4 py-3", className)}>
      <div className="flex h-full items-start">
        <div className="grid w-full grid-cols-5 gap-2.5">
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + dayStart;
            const isCompleted = dayNum < currentDay;
            const isCurrent = dayNum === currentDay;
            const isLocked = dayNum > currentDay;

            return (
              <motion.button
                key={dayNum}
                whileTap={{ scale: 0.95 }}
                disabled={isLocked}
                onClick={() => onActiveIndexChange(idx)}
                className={cn(
                  "relative flex aspect-square w-full flex-col items-center justify-center rounded-lg border transition-all duration-200",
                  isCompleted &&
                    "border-emerald-200 bg-emerald-50 text-emerald-700",
                  isCurrent &&
                    "z-10 scale-105 border-primary/40 bg-white text-primary shadow-sm ring-2 ring-primary/15",
                  isLocked &&
                    "cursor-not-allowed border-slate-200 bg-slate-100/70 text-slate-400",
                  !isCompleted &&
                    !isCurrent &&
                    !isLocked &&
                    "border-slate-200 bg-white text-slate-500",
                  activeIndex === idx &&
                    !isCurrent &&
                    "ring-2 ring-primary/40 border-primary/20",
                )}
              >
                <span className="mb-0.5 text-[8px] font-black opacity-55">
                  DAY
                </span>
                <span className="font-jalnan text-sm font-black leading-none">
                  {dayNum}
                </span>

                {isCompleted && (
                  <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                    <Check size={8} strokeWidth={4} />
                  </div>
                )}
                {isLocked && (
                  <Lock
                    size={10}
                    className="absolute bottom-1 right-1 opacity-30"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
