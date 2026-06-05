import { motion } from "framer-motion";
import day10Pic from "@/assets/images/coaching/meal/day10/day10.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day10Step2Props {
  step1: string;
}

export function Day10Step2({ step1 }: Day10Step2Props) {
  const { pt } = usePageTranslation("coaching/meal/day10");
  const isYes = step1.trim() === pt("MSG_007");

  const items = [
    { title: pt("MSG_011"), description: pt("MSG_034") },
    { title: pt("MSG_012"), description: pt("MSG_035") },
    { title: pt("MSG_013"), description: pt("MSG_036") },
    { title: pt("MSG_014"), description: pt("MSG_027") },
    { title: pt("MSG_015"), description: pt("MSG_028") },
    { title: pt("MSG_016"), description: pt("MSG_029") },
    { title: pt("MSG_017"), description: pt("MSG_030") },
    { title: pt("MSG_018"), description: pt("MSG_031") },
    { title: pt("MSG_019"), description: pt("MSG_032") },
    { title: pt("MSG_020"), description: pt("MSG_033") },
  ];

  return (
    <CoachingInfoStep title={pt("MSG_010")} image={day10Pic}>
      <div className="flex flex-col gap-10 pt-4 pb-12">
        {/* 상단 헤더 섹션: 이전 모듈과 디자인 통일 */}
        <div className="space-y-3 px-1 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {isYes ? pt("MSG_022") : pt("MSG_023")}
          </h3>
          <p className="text-base font-bold text-slate-500 break-keep">
            {isYes ? pt("MSG_037") : pt("MSG_038")}
          </p>
        </div>

        {/* 식재료 관리 리스트 섹션: 카드 레이아웃 적용 */}
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
