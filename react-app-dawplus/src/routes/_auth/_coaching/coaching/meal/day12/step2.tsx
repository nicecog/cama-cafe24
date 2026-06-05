import { motion } from "framer-motion";
import day12Pic from "@/assets/images/coaching/meal/day12/day12.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";
import { getDay12CheckAnswerList } from "./step1";

interface Day12Step2Props {
  step1Data: string[];
}

export function Day12Step2({ step1Data }: Day12Step2Props) {
  const { pt } = usePageTranslation("coaching/meal/day12");
  const day12CheckAnswerList = getDay12CheckAnswerList(pt);
  const selectedIndexes = step1Data
    .map((item) => day12CheckAnswerList.indexOf(item))
    .filter((idx) => idx !== -1);

  const adviceMap: Record<number, string[]> = {
    0: [pt("MSG_017"), pt("MSG_028")],
    1: [pt("MSG_018"), pt("MSG_029"), pt("MSG_034"), pt("MSG_035")],
    2: [pt("MSG_019"), pt("MSG_036")],
    3: [
      pt("MSG_020"),
      pt("MSG_030"),
      pt("MSG_031"),
      pt("MSG_032"),
      pt("MSG_037"),
    ],
    4: [pt("MSG_021"), pt("MSG_038")],
    5: [
      pt("MSG_022"),
      pt("MSG_039"),
      pt("MSG_040"),
      pt("MSG_041"),
      pt("MSG_042"),
    ],
    6: [pt("MSG_023"), pt("MSG_033"), pt("MSG_043")],
    7: [pt("MSG_024"), pt("MSG_044"), pt("MSG_045"), pt("MSG_046")],
  };

  return (
    <CoachingInfoStep title={pt("MSG_001")} image={day12Pic}>
      <div className="flex flex-col gap-10 pt-4 pb-12">
        {/* 상단 헤더 섹션: 모듈 일관성 유지 */}
        <div className="space-y-3 px-1 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            식사 시 겪는 어려움에 대한 조언
          </h3>
          <p className="text-base font-bold text-slate-500 break-keep">
            {pt("MSG_013")}
          </p>
        </div>

        {/* 조언 리스트 섹션: 선택된 항목에 맞춰 카드 생성 */}
        <div className="flex flex-col gap-10">
          {selectedIndexes.map((idx, sIdx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sIdx * 0.1 }}
              className="flex flex-col gap-4"
            >
              {/* 항목 헤더 */}
              <div className="flex items-center gap-3 px-1">
                <div className="h-2 w-2 rounded-full bg-primary shadow-sm" />
                <h4 className="text-lg font-black tracking-tight text-slate-900">
                  {day12CheckAnswerList[idx]}
                </h4>
              </div>

              {/* 조언 내용 카드 */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  {adviceMap[idx].map((advice, aIdx) => (
                    <p
                      key={aIdx}
                      className="text-base font-bold leading-relaxed text-slate-600 break-keep"
                    >
                      {advice}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CoachingInfoStep>
  );
}
