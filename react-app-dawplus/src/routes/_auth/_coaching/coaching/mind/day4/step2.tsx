import { motion } from "framer-motion";
import day4Pic from "@/assets/images/coaching/sleep/day4/day4.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day4Step2() {
  const { pt } = usePageTranslation("coaching/sleep/day4");

  return (
    <CoachingInfoStep title={pt("step2.msg_001")} image={day4Pic}>
      <div className="flex flex-col gap-6 pt-4 pb-12 w-full max-w-[28rem] mx-auto">
        {/* 상단 헤더 섹션 */}
        <div className="space-y-3 px-1 text-center flex flex-col items-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {pt("step2.msg_002")}
          </h3>
          <p className="text-base font-bold text-slate-500 break-keep">
            {pt("step2.msg_003")}
          </p>
          <div className="h-0.5 w-8 rounded-full bg-primary/30 mt-4" />
        </div>

        {/* 본문 텍스트 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 px-2 space-y-4 text-base font-semibold text-slate-700 leading-relaxed break-keep text-p["
        >
          <p>{pt("step2.msg_004")}</p>
          <p>{pt("step2.msg_005")}</p>
          <p>{pt("step2.msg_006")}</p>
          <p>{pt("step2.msg_007")}</p>
        </motion.div>
      </div>
    </CoachingInfoStep>
  );
}
