import { motion } from "framer-motion";
import { Check } from "lucide-react";
import day2Pic from "@/assets/images/coaching/meal/day2/day2.png";
import { useConditionalStepAlert } from "@/hooks/useConditionalStepAlert";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day2Step2Props {
  step1Value: string;
  shouldShowAlert: boolean;
}

export function Day2Step2({ step1Value, shouldShowAlert }: Day2Step2Props) {
  const { pt } = usePageTranslation("coaching/meal/day2");
  const isYes = step1Value.trim() === pt("MSG_007");

  useConditionalStepAlert(
    shouldShowAlert
      ? [
          {
            when: isYes,
            title: pt("MSG_023"),
            body: pt("MSG_024"),
          },
          {
            when: !isYes,
            title: pt("MSG_025"),
            body: pt("MSG_026"),
          },
        ]
      : [],
  );

  return (
    <CoachingInfoStep
      title={pt("MSG_010")}
      image={day2Pic}
      subtitle={pt("MSG_011")}
    >
      <Textbox className="font-semibold text-center text-lg">
        {pt("MSG_012")}
      </Textbox>

      <div className="flex flex-col gap-4 mt-12 pb-12">
        {/* 상단 헤더 섹션: 모듈 일관성 유지 */}

        {/* 첫 번째 방법 리스트 (체크 리스트) */}
        <div className="flex flex-col gap-3">
          {[14, 15, 16, 17, 18].map((num, idx) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                <Check size={14} strokeWidth={3} />
              </div>
              <p className="text-base font-bold leading-relaxed text-slate-700 break-keep">
                {pt(`MSG_0${num}`)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 중간 강조 가이드 배너 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Textbox className="font-semibold">{pt("MSG_101")}</Textbox>
        </motion.div>

        {/* 두 번째 방법 리스트 (체크 리스트) */}
        <div className="flex flex-col gap-3">
          {[103, 104, 105, 106, 107, 108].map((num, idx) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + idx * 0.05 }}
              className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                <Check size={14} strokeWidth={3} />
              </div>
              <p className="text-base font-bold leading-relaxed text-slate-700 break-keep">
                {pt(`MSG_${num}`)}
              </p>
            </motion.div>
          ))}
        </div>
        <Textbox className="font-semibold">{pt("MSG_109")}</Textbox>
      </div>
    </CoachingInfoStep>
  );
}
