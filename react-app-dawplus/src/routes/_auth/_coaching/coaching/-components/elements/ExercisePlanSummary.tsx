import { motion } from "framer-motion";
import physicalType from "@/assets/images/coaching/main/type4.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";

interface ExercisePlanSummaryProps {
  type: string;
  time: string;
}

export function ExercisePlanSummary({ type, time }: ExercisePlanSummaryProps) {
  const { pt } = usePageTranslation("coaching/coachingCommon");

  return (
    <div className="relative py-1">
      <div className="relative rounded-lg border border-primary/10 bg-white px-5 py-4 pr-16">
        <div className="text-slate-900">
          <p className="break-keep text-base font-bold leading-relaxed tracking-tight text-slate-500">
            {pt("exercise_plan_summary.prefix")}
          </p>

          <div className="mt-1.5">
            <p className="break-keep text-2xl font-black leading-snug tracking-tight text-slate-900">
              {type}
            </p>
          </div>

          <div className="mt-3">
            <span className="inline-flex rounded-full border border-primary/15 bg-primary/[0.08] px-3 py-1.5 text-base font-extrabold leading-none text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
              {time}
              {pt("exercise_selector.time_unit")}
            </span>
          </div>

          <p className="mt-3 break-keep text-base font-bold leading-relaxed tracking-tight text-slate-600">
            {pt("exercise_plan_summary.suffix")}
          </p>
        </div>
      </div>

      <div className="relative -mt-20 flex h-24 justify-end pr-2">
        <motion.img
          src={physicalType}
          alt=""
          animate={{
            x: [0, 1.5, 0, -1.5, 0],
            y: [0, -2, 0, -1, 0],
            rotate: [0, 1.2, 0, -1.2, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="pointer-events-none h-24 w-24 object-contain drop-shadow-[0_8px_14px_rgba(15,23,42,0.08)]"
        />
      </div>
    </div>
  );
}
