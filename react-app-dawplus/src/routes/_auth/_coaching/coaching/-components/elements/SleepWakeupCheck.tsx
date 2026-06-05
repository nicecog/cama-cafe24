import { AnimatePresence, motion } from "framer-motion";
import { Moon, SunMedium } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Day3Step1Data, Day3TimeData } from "../../sleep/day3/utils";

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 6 }, (_, j) =>
  String(j * 10).padStart(2, "0"),
);

interface SleepWakeupCheckProps {
  data: Day3Step1Data;
  onChange: (name: "sleep" | "wakeup", value: Day3TimeData) => void;
  className?: string;
}

export default function SleepWakeupCheck({
  data,
  onChange,
  className = "",
}: SleepWakeupCheckProps) {
  const [activePicker, setActivePicker] = useState<{
    section: "sleep" | "wakeup";
    type: "hour" | "minutes";
  } | null>(null);

  const sleepCardRef = useRef<HTMLDivElement>(null);
  const wakeupCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activePicker) {
      const targetRef =
        activePicker.section === "sleep" ? sleepCardRef : wakeupCardRef;

      setTimeout(() => {
        targetRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [activePicker]);

  const handleTogglePicker = (
    section: "sleep" | "wakeup",
    type: "hour" | "minutes",
  ) => {
    if (activePicker?.section === section && activePicker?.type === type) {
      setActivePicker(null);
    } else {
      setActivePicker({ section, type });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* 1. 목표 취침시간 */}
      <div ref={sleepCardRef} className="scroll-mt-10">
        <TimeCard
          isActive={activePicker?.section === "sleep"}
          icon={<Moon className="h-5 w-5" />}
          title="목표 취침시간"
          description="잠드는 시간을 먼저 정해보세요."
        >
          <div className="flex flex-col gap-5">
            <div className="flex justify-center gap-4">
              <ClockUnit
                value={data.sleep.hour}
                label="시"
                section="sleep"
                isActive={
                  activePicker?.section === "sleep" &&
                  activePicker?.type === "hour"
                }
                onClick={() => handleTogglePicker("sleep", "hour")}
              />
              <span className="mt-4 text-2xl font-bold text-slate-200">:</span>
              <ClockUnit
                value={data.sleep.minutes}
                label="분"
                section="sleep"
                isActive={
                  activePicker?.section === "sleep" &&
                  activePicker?.type === "minutes"
                }
                onClick={() => handleTogglePicker("sleep", "minutes")}
              />
            </div>

            <AnimatePresence>
              {activePicker?.section === "sleep" && (
                <GridPicker
                  options={activePicker.type === "hour" ? hours : minutes}
                  value={
                    activePicker.type === "hour"
                      ? data.sleep.hour
                      : data.sleep.minutes
                  }
                  onChange={(val: string) => {
                    onChange("sleep", {
                      ...data.sleep,
                      [activePicker.type]: val,
                    });
                    if (activePicker.type === "hour")
                      setActivePicker({ section: "sleep", type: "minutes" });
                    else setActivePicker(null);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </TimeCard>
      </div>

      {/* 2. 목표 기상시간 */}
      <div ref={wakeupCardRef} className="scroll-mt-10">
        <TimeCard
          isActive={activePicker?.section === "wakeup"}
          icon={<SunMedium className="h-5 w-5" />}
          title="목표 기상시간"
          description="일어날 시간을 여유 있게 잡아주세요."
        >
          <div className="flex flex-col gap-5">
            <div className="flex justify-center gap-4">
              <ClockUnit
                value={data.wakeup.hour}
                label="시"
                section="wakeup"
                isActive={
                  activePicker?.section === "wakeup" &&
                  activePicker?.type === "hour"
                }
                onClick={() => handleTogglePicker("wakeup", "hour")}
              />
              <span className="mt-4 text-2xl font-bold text-slate-200">:</span>
              <ClockUnit
                value={data.wakeup.minutes}
                label="분"
                section="wakeup"
                isActive={
                  activePicker?.section === "wakeup" &&
                  activePicker?.type === "minutes"
                }
                onClick={() => handleTogglePicker("wakeup", "minutes")}
              />
            </div>

            <AnimatePresence>
              {activePicker?.section === "wakeup" && (
                <GridPicker
                  options={activePicker.type === "hour" ? hours : minutes}
                  value={
                    activePicker.type === "hour"
                      ? data.wakeup.hour
                      : data.wakeup.minutes
                  }
                  onChange={(val: string) => {
                    onChange("wakeup", {
                      ...data.wakeup,
                      [activePicker.type]: val,
                    });
                    if (activePicker.type === "hour")
                      setActivePicker({ section: "wakeup", type: "minutes" });
                    else setActivePicker(null);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </TimeCard>
      </div>
    </div>
  );
}

interface TimeCardProps {
  isActive: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

function TimeCard({
  isActive,
  icon,
  title,
  description,
  children,
}: TimeCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[2.5rem] border-2 bg-white p-7 transition-all duration-500",
        isActive
          ? "border-primary/40 shadow-2xl shadow-primary/10 scale-[1.02]"
          : "border-slate-50 shadow-sm shadow-slate-200/50",
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-500",
            isActive
              ? "bg-primary text-white shadow-lg shadow-primary/30"
              : "bg-slate-100 text-slate-400",
          )}
        >
          {icon}
        </div>
        <div>
          <h3
            className={cn(
              "text-lg font-black tracking-tight",
              isActive ? "text-slate-900" : "text-slate-800",
            )}
          >
            {title}
          </h3>
          <p className="text-[13px] font-semibold text-slate-400">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

interface ClockUnitProps {
  value: string;
  label: string;
  isActive: boolean;
  section: string;
  onClick: () => void;
}

function ClockUnit({
  value,
  label,
  isActive,
  section,
  onClick,
}: ClockUnitProps) {
  return (
    <button
      onClick={onClick}
      data-section={section}
      className={cn(
        "group relative flex h-24 w-28 flex-col items-center justify-center rounded-[2rem] border-2 transition-all duration-300 active:scale-95",
        isActive
          ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-xl shadow-primary/10"
          : "border-slate-50 bg-slate-50/50 hover:border-slate-100",
      )}
    >
      <span
        className={cn(
          "text-4xl font-black tabular-nums tracking-tight transition-all",
          isActive ? "text-primary scale-110" : "text-slate-400",
        )}
      >
        {value || "--"}
      </span>
      <span
        className={cn(
          "mt-1 text-[11px] font-bold uppercase tracking-wider",
          isActive ? "text-primary/60" : "text-slate-300",
        )}
      >
        {label}
      </span>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute -bottom-1 h-1.5 w-6 rounded-full bg-primary"
        />
      )}
    </button>
  );
}

interface GridPickerProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

function GridPicker({ options, value, onChange }: GridPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="grid grid-cols-6 gap-2 rounded-[2rem] border border-primary/10 bg-slate-50/80 p-4"
    >
      {options.map((opt: string) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "flex h-12 items-center justify-center rounded-2xl text-base font-black transition-all active:scale-90",
            value === opt
              ? "bg-primary text-white shadow-xl shadow-primary/30 scale-105"
              : "text-slate-400 hover:bg-white hover:text-primary hover:shadow-md",
          )}
        >
          {opt}
        </button>
      ))}
    </motion.div>
  );
}
