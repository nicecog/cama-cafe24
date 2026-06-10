import { motion } from "framer-motion";
import day15Pic from "@/assets/images/coaching/physical/day15.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day15Step2() {
  const { pt } = usePageTranslation("coaching/physical/day15");
  const bodies = [12, 13, 14, 15, 16].map((key) =>
    pt(`MSG_${String(key).padStart(3, "0")}`)
  );

  return (
    <CoachingInfoStep
      title={pt("MSG_009")}
      image={day15Pic}
      subtitle={pt("MSG_010")}
    >
      <div className="flex flex-col gap-6 mt-8 pb-12">
        <div className="flex flex-col gap-4">
          {bodies.map((body, idx) => (
            <motion.div
              key={body}
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
                  {body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CoachingInfoStep>
  );
}
