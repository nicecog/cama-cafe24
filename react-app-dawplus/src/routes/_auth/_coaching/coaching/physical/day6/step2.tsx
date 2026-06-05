import { motion } from "framer-motion";
import { Check } from "lucide-react";
import day6Pic from "@/assets/images/coaching/physical/day6.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { ExercisePlanSummary } from "../../-components/elements/ExercisePlanSummary";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day6Step2Props {
  step1: {
    type: string;
    time: string;
  };
}

export function Day6Step2({ step1 }: Day6Step2Props) {
  const { pt } = usePageTranslation("coaching/physical/day6");

  const sections = [
    {
      title: pt("MSG_008").replace(/^✔\s*/, ""),
      content: pt("MSG_007").replace(pt("MSG_008"), "").trim(),
    },
    {
      title: pt("MSG_010").replace(/^✔\s*/, ""),
      content: pt("MSG_009").replace(pt("MSG_010"), "").trim(),
    },
  ];

  return (
    <CoachingInfoStep
      title={pt("MSG_005")}
      image={day6Pic}
      subtitle={pt("MSG_006")}
    >
      <div className="flex flex-col gap-6 mt-12 pb-12">
        <div className="flex flex-col gap-6">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col gap-3"
            >
              {/* 체크 아이콘과 타이틀 (카드 외부 분리) */}
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-lg font-black tracking-tight">
                  {section.title}
                </span>
              </div>

              {/* 본문 카드 */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ring-1 ring-slate-100/50">
                <p className="text-base font-bold leading-relaxed break-keep">
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-2"
        >
          <ExercisePlanSummary type={step1.type} time={step1.time} />
        </motion.div>
      </div>
    </CoachingInfoStep>
  );
}
