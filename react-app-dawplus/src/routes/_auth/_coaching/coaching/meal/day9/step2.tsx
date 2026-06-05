import { motion } from "framer-motion";
import day9Pic1 from "@/assets/images/coaching/meal/day9/day9_1.png";
import day9Pic2 from "@/assets/images/coaching/meal/day9/day9_2.png";
import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day9Step2Props {
  step1: string;
}

export function Day9Step2({ step1 }: Day9Step2Props) {
  const { pt } = usePageTranslation("coaching/meal/day9");
  const isYes = step1 === pt("MSG_007");
  const accountName = useAccountName();

  const items = [
    { title: pt("MSG_011"), description: pt("MSG_032") },
    { title: pt("MSG_012"), description: pt("MSG_033") },
    { title: pt("MSG_013"), description: pt("MSG_034") },
    { title: pt("MSG_014"), description: pt("MSG_035") },
    { title: pt("MSG_015"), description: pt("MSG_036") },
    { title: pt("MSG_016"), description: pt("MSG_037") },
    { title: pt("MSG_017"), description: pt("MSG_040") },
  ];

  return (
    <CoachingInfoStep title={pt("MSG_010")} image={isYes ? day9Pic1 : day9Pic2}>
      <div className="flex flex-col gap-10 pt-4 pb-12">
        {/* 상단 헤더 섹션: 일관된 스타일 적용 */}
        <div className="space-y-3 px-1 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {isYes ? pt("MSG_018") : pt("MSG_019")}
          </h3>
          <div className="space-y-1">
            <p className="text-base font-bold text-slate-500 break-keep">
              {isYes ? pt("MSG_041") : pt("MSG_020", { name: accountName })}
            </p>
            {isYes && (
              <p className="text-base font-bold text-slate-500 break-keep">
                {pt("MSG_042")}
              </p>
            )}
          </div>
        </div>

        {/* 전략 리스트 섹션: 카드 레이아웃 적용 */}
        <div className="flex flex-col gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 px-1">
                <div className="h-2 w-2 rounded-full bg-primary shadow-sm" />
                <h4 className="text-lg font-black tracking-tight text-slate-900">
                  {item.title}
                </h4>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-base font-bold leading-relaxed text-slate-600 break-keep">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CoachingInfoStep>
  );
}
