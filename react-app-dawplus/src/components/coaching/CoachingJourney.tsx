import { LayoutGroup, motion } from "framer-motion";
import { Check, Play } from "lucide-react";
import { useEffect, useRef } from "react";
import headImg from "@/assets/images/character/head/type2.png";
import { cn } from "@/lib/utils";
import { COACHING_DATA, type CoachingType } from "./coachingData";

interface CoachingJourneyProps {
  type: CoachingType;
  currentDay: number;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  className?: string;
}

export function CoachingJourney({
  type,
  currentDay,
  activeIndex,
  onActiveIndexChange,
  className,
}: CoachingJourneyProps) {
  const content = COACHING_DATA[type];
  const missions = content.missions;
  const dayStart = content.dayStart ?? 1;
  const currentDayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetDay = currentDay;

    if (targetDay >= dayStart) {
      currentDayRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [currentDay, dayStart]);

  return (
    <div className={cn("min-h-0 flex-1 bg-white flex flex-col", className)}>
      {/* 코칭 Header */}
      <div className="mb-2 flex items-center justify-between px-4 py-3">
        <p className="text-sm font-semibold text-slate-500">
          {content.journeyTitle}
        </p>
        <p className="text-sm font-bold text-primary">현재 Day {currentDay}</p>
      </div>

      <div className="h-full overflow-y-auto pr-1 px-4 py-3">
        <LayoutGroup>
          <div className="relative px-7 pt-1">
            <div className="absolute bottom-0 left-3.5 top-0 w-1 bg-primary/40" />

            {missions.map((missionName, idx) => {
              const dayNum = idx + dayStart;
              const isCompleted = dayNum < currentDay;
              const isCurrent = dayNum === currentDay;
              const isFuture = dayNum > currentDay;
              const isActive = activeIndex === idx;

              return (
                <div
                  key={dayNum}
                  ref={dayNum === currentDay ? currentDayRef : undefined}
                  className="relative mb-3 flex items-center"
                >
                  {/* Timeline Point */}
                  <div className="absolute left-[-23.5px] flex items-center justify-center">
                    <div
                      className={cn(
                        "flex h-6 w-6 p-1 items-center justify-center rounded-full transition-all duration-500",
                        isCompleted
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : isCurrent
                            ? "border-primary border bg-white text-primary"
                            : "border-slate-200 bg-white text-slate-300",
                      )}
                    >
                      {isCompleted ? (
                        <Check size={13} strokeWidth={4} />
                      ) : (
                        <Play size={13} strokeWidth={4} fill="currentColor" />
                      )}
                    </div>
                  </div>

                  <motion.button
                    layout="position"
                    initial={false}
                    type="button"
                    onClick={() => {
                      if (!isActive) onActiveIndexChange(idx);
                    }}
                    aria-label={`Day ${dayNum} ${missionName} ${
                      isCompleted
                        ? "완료"
                        : isCurrent
                          ? "현재 진행 중"
                          : "미리보기"
                    }`}
                    aria-current={isCurrent ? "step" : undefined}
                    transition={{
                      layout: {
                        duration: 0.45,
                        ease: [0.23, 1, 0.32, 1],
                      },
                      opacity: { duration: 0.2 },
                    }}
                    whileHover={isActive ? undefined : { y: -1, scale: 1.005 }}
                    whileTap={isActive ? undefined : { scale: 0.995 }}
                    className={cn(
                      "relative ml-3 flex min-h-11 items-center overflow-hidden rounded-2xl",
                      isActive
                        ? "w-full border bg-white p-4"
                        : "w-[min(10.5rem,60vw)] border border-slate-100 bg-white px-4",
                      isActive && "cursor-default",
                      !isActive &&
                        isCompleted &&
                        "border-emerald-100 bg-emerald-50/50",
                      !isActive &&
                        isCurrent &&
                        "border-primary/30 bg-primary/[0.02]",
                      !isActive && isFuture && "border-slate-100 bg-white",
                      activeIndex === idx &&
                        !isCurrent &&
                        "ring-2 ring-primary/40 border-primary/20",
                    )}
                  >
                    {isActive ? (
                      <motion.div
                        key="active"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { duration: 0.18, ease: "easeOut" },
                        }}
                        exit={{
                          opacity: 0,
                          transition: { duration: 0.12, ease: "easeIn" },
                        }}
                        className="w-full text-left"
                      >
                        <div className="mb-1.5 flex items-center justify-between">
                          <span
                            className={cn(
                              "whitespace-nowrap text-sm font-black uppercase tracking-widest",
                              isCompleted ? "text-emerald-600" : "text-primary",
                            )}
                          >
                            Day {dayNum}
                          </span>
                          {isCompleted ? (
                            <Check
                              size={12}
                              className="text-emerald-500"
                              strokeWidth={4}
                            />
                          ) : null}
                        </div>

                        <h3 className="font-jalnan text-lg text-slate-900 flex items-center gap-4">
                          <img
                            src={headImg}
                            alt=""
                            aria-hidden="true"
                            className="h-12 shrink-0"
                          />
                          <span className="mt-0.5 break-keep leading-tight">
                            {missionName}
                          </span>
                        </h3>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="inactive"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { duration: 0.16, ease: "easeOut" },
                        }}
                        exit={{
                          opacity: 0,
                          transition: { duration: 0.12, ease: "easeIn" },
                        }}
                        className="flex w-full items-center justify-between"
                      >
                        <span
                          className={cn(
                            "font-jalnan text-sm transition-colors",
                            isCompleted
                              ? "text-emerald-600"
                              : isCurrent
                                ? "text-primary"
                                : "text-slate-400",
                          )}
                        >
                          Day {dayNum}
                        </span>
                        {isCompleted ? (
                          <Check
                            size={10}
                            className="text-emerald-400"
                            strokeWidth={4}
                          />
                        ) : isCurrent ? (
                          <motion.div
                            animate={{
                              opacity: [0.55, 1, 0.55],
                              scale: [0.96, 1, 0.96],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2.4,
                              ease: "easeInOut",
                            }}
                            className="h-1.5 w-1.5 rounded-full bg-primary"
                          />
                        ) : null}
                      </motion.div>
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}
