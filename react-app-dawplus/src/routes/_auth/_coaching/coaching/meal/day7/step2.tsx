import { motion } from "framer-motion";
import day7Pic from "@/assets/images/coaching/meal/day7/day7.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day7Step2Props {
  step1: string;
}

export function Day7Step2({ step1 }: Day7Step2Props) {
  const { pt } = usePageTranslation("coaching/meal/day7");
  const isYes = step1.trim() === pt("MSG_007");

  const advices = [
    { title: pt("MSG_014"), description: pt("MSG_015") },
    { title: pt("MSG_016"), description: pt("MSG_017") },
    { title: pt("MSG_018"), description: pt("MSG_019") },
    { title: pt("MSG_020"), description: pt("MSG_021") },
    { title: pt("MSG_022"), description: pt("MSG_023") },
  ];

  return (
    <CoachingInfoStep title={pt("MSG_010")} image={day7Pic}>
      <div className="flex flex-col gap-10 pt-4">
        {/* 상단 헤더 섹션: Day 5 스타일과 통일 */}
        <div className="space-y-2 px-1">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {isYes ? pt("MSG_011") : pt("MSG_012")}
          </h3>
          <p className="text-base font-bold text-slate-500 break-keep">
            {pt("MSG_013")}
          </p>
        </div>

        {/* 조언 리스트 섹션: Day 5 스타일의 카드 레이아웃 적용 */}
        <div className="flex flex-col gap-8 pb-8">
          {advices.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                {/* 숫자는 제외하고 카드와 타이틀 구조만 유지 */}
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
