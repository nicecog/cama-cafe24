import { motion } from "framer-motion";
import day8Pic1 from "@/assets/images/coaching/sleep/day8/day8Pic1.png";
import day8Pic2 from "@/assets/images/coaching/sleep/day8/day8Pic2.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day8Step2Props {
  isYes: boolean;
}

export function Day8Step2({ isYes }: Day8Step2Props) {
  const { pt } = usePageTranslation("coaching/sleep/day8");

  return (
    <CoachingInfoStep
      title={pt("step2.msg_001")}
      image={isYes ? day8Pic1 : day8Pic2}
    >
      <div className="flex flex-col gap-6 pt-4 pb-12 w-full max-w-[28rem] mx-auto">
        {isYes ? (
          <>
            {/* 상단 헤더 섹션 (긍정 답변) */}
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
              className="mt-4 px-2 space-y-4 text-base font-semibold text-slate-700 leading-relaxed break-keep"
            >
              <p>{pt("step2.msg_004")}</p>
              <p>{pt("step2.msg_005")}</p>
            </motion.div>
          </>
        ) : (
          <>
            {/* 상단 헤더 섹션 (부정 답변) */}
            <div className="space-y-3 px-1 text-center flex flex-col items-center">
              <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
                {pt("step2.msg_006")}
              </h3>
              <div className="h-0.5 w-8 rounded-full bg-primary/30 mt-4" />
            </div>

            {/* 본문 텍스트 섹션 */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 px-2 space-y-4 text-base font-semibold text-slate-700 leading-relaxed break-keep"
            >
              <p>{pt("step2.msg_007")}</p>
              <p>{pt("step2.msg_008")}</p>
            </motion.div>
          </>
        )}
      </div>
    </CoachingInfoStep>
  );
}
