import { motion } from "framer-motion";
import day15Pic from "@/assets/images/coaching/meal/day15/day15.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day15Step2Props {
  data: string;
}

export function Day15Step2({ data }: Day15Step2Props) {
  const { pt } = usePageTranslation("coaching/meal/day15");
  const isYes = data === pt("MSG_007");

  const benefits = [
    { title: pt("MSG_014"), content: pt("MSG_027") },
    { title: pt("MSG_016"), content: pt("MSG_028") },
    { title: pt("MSG_018"), content: pt("MSG_029") },
    { title: pt("MSG_020"), content: pt("MSG_021") },
    { title: pt("MSG_022"), content: pt("MSG_023") },
  ];

  return (
    <CoachingInfoStep title={pt("MSG_010")} image={day15Pic}>
      <div className="flex flex-col gap-10 pt-4 pb-12">
        {/* 상단 헤더 섹션: 모듈 일관성 유지 */}
        <div className="space-y-3 px-1 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {isYes ? pt("MSG_011") : pt("MSG_012")}
          </h3>
          <p className="text-base font-bold text-slate-500 break-keep">
            {pt("MSG_013")} <br />
            {pt("MSG_033")}
          </p>
        </div>

        {/* 이점 리스트 섹션: 카드 형태로 변경 */}
        <div className="flex flex-col gap-10">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col gap-4"
            >
              {/* 항목 헤더 */}
              <div className="flex items-center gap-3 px-1">
                <div className="h-2 w-2 rounded-full bg-primary shadow-sm" />
                <h4 className="text-lg font-black tracking-tight text-slate-900">
                  {benefit.title}
                </h4>
              </div>

              {/* 조언 내용 카드 */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-base font-bold leading-relaxed text-slate-600 break-keep">
                  {benefit.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CoachingInfoStep>
  );
}
