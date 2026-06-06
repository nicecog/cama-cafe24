import { motion } from "framer-motion";
import day10Pic from "@/assets/images/coaching/physical/day10.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { ExercisePlanSummary } from "../../-components/elements/ExercisePlanSummary";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day10Step2Props {
  step1: {
    type: string;
    time: string;
  };
}

export function Day10Step2({ step1 }: Day10Step2Props) {
  const { pt } = usePageTranslation("coaching/physical/day10");
  const sections = [
    pt("MSG_007").replace(/^✔\s*/, ""),
    pt("MSG_008").replace(/^✔\s*/, ""),
    pt("MSG_009").replace(/^✔\s*/, ""),
  ];

  return (
    <CoachingInfoStep
      title={pt("MSG_005")}
      image={day10Pic}
      subtitle={pt("MSG_006")}
    >
      <div className="flex flex-col gap-6 mt-8 pb-12">
        <div className="flex flex-col gap-4">
          {sections.map((section, idx) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative mt-2"
            >
              {/* 절대적 위치로 둥둥 떠있는 숫자 배지 */}
              <div className="absolute -top-2.5 -left-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-black text-white shadow-md shadow-primary/20 ring-2 ring-white">
                {idx + 1}
              </div>

              {/* 본문 카드 */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 pl-8 shadow-sm ring-1 ring-slate-100/50">
                <p className="text-base font-bold leading-relaxed break-keep text-slate-800">
                  {section}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4"
        >
          <ExercisePlanSummary type={step1.type} time={step1.time} />
        </motion.div>
      </div>
    </CoachingInfoStep>
  );
}
