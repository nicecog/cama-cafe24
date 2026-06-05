import { motion } from "framer-motion";
import Day16ReviewImg from "@/assets/images/character/char4.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day16Step2Props {
  accountName: string;
}

export function Day16Step2({ accountName }: Day16Step2Props) {
  const { pt } = usePageTranslation("coaching/sleep/day16");

  return (
    <CoachingInfoStep image={Day16ReviewImg}>
      <div className="flex flex-col gap-6 pt-4 pb-12 w-full max-w-[28rem] mx-auto">
        {/* 상단 헤더 섹션 */}
        <div className="space-y-3 px-1 text-center flex flex-col items-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {pt("step2.msg_002", { accountName })}
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
          <p>{pt("step2.msg_003", { accountName })}</p>
          <p>{pt("step2.msg_004")}</p>
        </motion.div>
      </div>
    </CoachingInfoStep>
  );
}
