import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import day6Pic1 from "@/assets/images/coaching/meal/day6/day6_1.png";
import day6Pic2 from "@/assets/images/coaching/meal/day6/day6_2.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useCoachingInitialData } from "@/hooks/queries";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day6Step2Props {
  step1: string;
}

export function Day6Step2({ step1 }: Day6Step2Props) {
  const { pt } = usePageTranslation("coaching/meal/day6");
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const { progressList } = useCoachingInitialData(loginId, "B", 16);
  const diseaseName = progressList[0]?.diseaseName ?? "";
  const isYes = step1.trim() === pt("MSG_007");

  const reasons = [
    { title: pt("MSG_031").replace("✔ ", ""), description: pt("MSG_032") },
    { title: pt("MSG_033").replace("✔ ", ""), description: pt("MSG_034") },
    { title: pt("MSG_035").replace("✔ ", ""), description: pt("MSG_036") },
    { title: pt("MSG_037").replace("✔ ", ""), description: pt("MSG_040") },
    { title: pt("MSG_041").replace("✔ ", ""), description: pt("MSG_042") },
  ];

  return (
    <CoachingInfoStep title={pt("MSG_010")} image={isYes ? day6Pic1 : day6Pic2}>
      <div className="flex flex-col gap-10 pt-4">
        {isYes ? (
          /* '예' 선택 시 디자인: 심플한 카드 리스트 */
          <Textbox className="space-y-4">
            <div className="flex flex-col items-center gap-4 px-2 text-center">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 break-keep">
                {pt("MSG_011")}
              </h3>
              <p className="text-base font-bold leading-relaxed text-slate-500 break-keep">
                {pt("MSG_028")}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <p className="text-base font-bold leading-relaxed text-slate-600 break-keep">
                {pt("MSG_023")}
              </p>
              <p className="text-base font-bold leading-relaxed text-slate-600 break-keep">
                {pt("MSG_024")}
              </p>
            </motion.div>
          </Textbox>
        ) : (
          /* '아니오' 선택 시 디자인: 넘버링 가이드 리스트 */
          <div className="space-y-10">
            <div className="flex flex-col items-center gap-4 px-2 text-center">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 break-keep">
                {pt("MSG_012")}
              </h3>
              <div className="space-y-2">
                <p className="text-base font-bold leading-relaxed text-slate-500 break-keep">
                  {pt("MSG_014")}
                </p>
                <p className="text-base font-bold text-primary break-keep">
                  {pt("MSG_030")}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {reasons.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3 px-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary font-black text-sm text-white shadow-lg shadow-primary/20">
                      {idx + 1}
                    </div>
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
        )}

        {/* 간암 환자 공통 주의사항 */}
        {diseaseName === "간암" && (
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-sm font-black uppercase tracking-wider text-primary">
                {pt("MSG_016")}
              </span>
            </div>
            <p className="text-base font-bold leading-relaxed text-slate-700 break-keep">
              {isYes ? pt("MSG_029") : pt("MSG_043")}
            </p>
          </div>
        )}
      </div>
    </CoachingInfoStep>
  );
}
