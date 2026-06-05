import { motion } from "framer-motion";
import { Check } from "lucide-react";
import day5Pic from "@/assets/images/coaching/physical/day5.png";
import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day5Step2() {
  const { pt } = usePageTranslation("coaching/physical/day5");
  const accountName = useAccountName();

  const sections = [
    {
      title: pt("MSG_015").replace(/^✔\s*/, ""),
      content: pt("MSG_014").replace(pt("MSG_015"), "").trim(),
    },
    {
      title: pt("MSG_017").replace(/^✔\s*/, ""),
      content: pt("MSG_016").replace(pt("MSG_017"), "").trim(),
    },
  ];

  return (
    <CoachingInfoStep
      title={pt("MSG_012")}
      image={day5Pic}
      subtitle={pt("MSG_013", { name: accountName })}
    >
      <Textbox className="font-semibold text-center text-lg">
        {pt("MSG_022", { name: accountName })}
      </Textbox>
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
      </div>
    </CoachingInfoStep>
  );
}
