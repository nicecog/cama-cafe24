import { motion } from "framer-motion";
import IncrementNumber from "@/components/effect/IncrementNumber";
import { cn } from "@/lib/utils";
import { COACHING_DATA, type CoachingType } from "./coachingData";

interface CoachingHeaderProps {
  type: CoachingType;
  currentDay: number;
  className?: string;
}

export function CoachingHeader({
  type,
  currentDay,
  className,
}: CoachingHeaderProps) {
  const content = COACHING_DATA[type];
  const dayStart = content.dayStart ?? 1;
  const maxDay = content.missions.length - 1 + dayStart;
  const displayDay = Math.min(currentDay, maxDay);
  const totalProgressSpan = Math.max(maxDay - dayStart, 1);
  const progressedDays = Math.min(
    Math.max(currentDay - dayStart, 0),
    totalProgressSpan,
  );
  const progress = Math.round((progressedDays / totalProgressSpan) * 100);

  return (
    <div
      className={cn(
        "relative flex shrink-0 flex-col border-b border-slate-100 px-5 pt-6 pb-4 bg-white",
        className,
      )}
    >
      <div className="relative mb-1 flex items-start justify-between">
        <div className="flex flex-col mb-1">
          <h1 className="mb-1 font-jalnan text-[34px] font-black leading-none tracking-tight">
            {content.title}
          </h1>
          <p className="break-keep text-sm font-bold leading-relaxed">
            {content.headerDescription}
          </p>
        </div>

        {/* Mascot with Glow Effect */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative transition-all"
        >
          <img
            src={content.mascot}
            alt={`${content.title} 코칭 캐릭터`}
            className="relative h-[72px] w-auto drop-shadow-[0_8px_20px_rgba(0,102,204,0.16)]"
          />
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="rounded-lg border border-primary/30 bg-primary/[0.03] p-3">
          <div className="space-y-1">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-sm font-bold text-slate-500">
                {content.progressLabel}
              </span>
              <div
                className={cn(
                  "flex items-center gap-0.5",
                  "text-xs font-black text-primary",
                )}
              >
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  Day {displayDay} / {maxDay}
                </span>
                <div className="w-10 text-right">
                  <IncrementNumber target={progress} />%
                </div>
              </div>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-lg shadow-primary/20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
