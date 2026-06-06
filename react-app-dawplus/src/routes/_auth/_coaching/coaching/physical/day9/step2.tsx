import { motion } from "framer-motion";
import { Check } from "lucide-react";
import day9Pic1 from "@/assets/images/coaching/physical/day9_1.png";
import day9Pic2 from "@/assets/images/coaching/physical/day9_2.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day9Step2(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day9");
  const { step1 } = props;
  const sections = [
    {
      title: pt("MSG_014").replace(/^✔\s*/, ""),
      content: pt("MSG_013").replace(pt("MSG_014"), "").trim(),
    },
    {
      title: pt("MSG_016").replace(/^✔\s*/, ""),
      content: pt("MSG_015").replace(pt("MSG_016"), "").trim(),
    },
    {
      title: pt("MSG_018").replace(/^✔\s*/, ""),
      content: pt("MSG_017").replace(pt("MSG_018"), "").trim(),
    },
  ];

  return (
    <CoachingInfoStep
      title={pt("MSG_008")}
      image={step1 === pt("MSG_011") ? day9Pic2 : day9Pic1}
    >
      <div className="flex flex-col gap-10 pt-4 pb-12">
        <div className="space-y-3 px-1 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {pt("MSG_010")}
          </h3>
          <p className="text-base font-bold text-slate-500 break-keep">
            {pt("MSG_019")}
          </p>
        </div>

        <div className="flex flex-col gap-6 mt-12 pb-12">
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
