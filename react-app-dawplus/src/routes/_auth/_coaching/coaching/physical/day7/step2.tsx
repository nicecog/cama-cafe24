import { motion } from "framer-motion";
import day7Pic from "@/assets/images/coaching/physical/day7.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day7Step2() {
  const { pt } = usePageTranslation("coaching/physical/day7");

  const sections = [
    { content: pt("MSG_013").replace(/^[1-5]\)\s*/, "") },
    { content: pt("MSG_014").replace(/^[1-5]\)\s*/, "") },
    { content: pt("MSG_015").replace(/^[1-5]\)\s*/, "") },
    { content: pt("MSG_016").replace(/^[1-5]\)\s*/, "") },
    { content: pt("MSG_017").replace(/^[1-5]\)\s*/, "") },
  ];

  return (
    <CoachingInfoStep
      title={pt("MSG_011")}
      image={day7Pic}
      subtitle={pt("MSG_012")}
    >
      <div className="flex flex-col gap-6 mt-12 pb-12">
        <div className="flex flex-col gap-3">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
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
              <Textbox className="rounded-2xl border border-slate-100 bg-white p-5 pl-8 shadow-sm ring-1 ring-slate-100/50">
                <p className="text-base font-bold leading-relaxed break-keep">
                  {section.content}
                </p>
              </Textbox>
            </motion.div>
          ))}
        </div>
      </div>
    </CoachingInfoStep>
  );
}
