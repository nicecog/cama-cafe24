import { motion } from "framer-motion";
import day16Pic from "@/assets/images/coaching/meal/day16/day16.png";
import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day16Step2() {
  const accountName = useAccountName();
  const { pt } = usePageTranslation("coaching/meal/day16");

  return (
    <CoachingInfoStep image={day16Pic}>
      <div className="flex flex-col gap-10 pt-4 pb-12">
        {/* 상단 헤더 섹션: 모듈 일관성 유지 */}
        <div className="space-y-3 px-1 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {pt("MSG_009", { name: accountName })}
          </h3>
          <p className="text-base font-bold text-slate-500 break-keep">
            {pt("MSG_010")}
          </p>
        </div>

        {/* 단락별 프리미엄 메시지 카드 (타이틀 없는 형태) */}
        <div className="flex flex-col gap-4">
          {/* 카드 1 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex gap-4 items-start"
          >
            <span className="text-2xl mt-0.5 leading-none">🌱</span>
            <p className="text-base font-bold leading-relaxed text-slate-600 break-keep">
              {pt("MSG_011")} <br />
              {pt("MSG_017")}
            </p>
          </motion.div>

          {/* 카드 2 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex gap-4 items-start"
          >
            <span className="text-2xl mt-0.5 leading-none">❤️</span>
            <p className="text-base font-bold leading-relaxed text-slate-600 break-keep">
              {pt("MSG_012")}
            </p>
          </motion.div>
        </div>
      </div>
    </CoachingInfoStep>
  );
}
