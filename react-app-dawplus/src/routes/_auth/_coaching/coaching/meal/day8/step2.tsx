import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import day8Pic1 from "@/assets/images/coaching/meal/day8/day8_1.png";
import day8Pic2 from "@/assets/images/coaching/meal/day8/day8_2.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useCoachingInitialData } from "@/hooks/queries";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day8Step2Props {
  step1: string;
}

export function Day8Step2({ step1 }: Day8Step2Props) {
  const { pt } = usePageTranslation("coaching/meal/day8");
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const { progressList } = useCoachingInitialData(loginId, "B", 16);
  const diseaseName = progressList[0]?.diseaseName ?? "";
  const isYes = step1.trim() === pt("MSG_007");

  const benefits = [
    { title: "항산화 성분", description: pt("MSG_014") },
    { title: "면역계 강화", description: pt("MSG_015") },
    { title: "염증 감소", description: pt("MSG_016") },
    { title: "부작용 완화", description: pt("MSG_017") },
    { title: "영양 상태 개선", description: pt("MSG_018") },
  ];

  const diseaseInfo = {
    title:
      (diseaseName === "대장암" && pt("MSG_020")) ||
      (diseaseName === "소장암" && pt("MSG_022")) ||
      (diseaseName === "난소암" && pt("MSG_024")) ||
      (diseaseName === "신장암" && pt("MSG_026")) ||
      (diseaseName === "간암" && pt("MSG_028")),
    description:
      (diseaseName === "대장암" && pt("MSG_021")) ||
      (diseaseName === "소장암" && pt("MSG_023")) ||
      (diseaseName === "난소암" && pt("MSG_025")) ||
      (diseaseName === "신장암" && pt("MSG_027")) ||
      (diseaseName === "간암" && pt("MSG_029")),
  };

  return (
    <CoachingInfoStep title={pt("MSG_010")} image={isYes ? day8Pic1 : day8Pic2}>
      <div className="flex flex-col gap-10 pt-4 pb-12">
        {/* 상단 헤더 섹션: Day 7과 완벽 일치 */}
        <div className="space-y-2 px-1">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {isYes ? pt("MSG_011") : pt("MSG_012")}
          </h3>
          <p className="text-base font-bold text-slate-500 break-keep">
            {pt("MSG_013")}
          </p>
        </div>

        {/* 조언 리스트 섹션: Day 7의 디자인 시스템을 그대로 적용 */}
        <div className="flex flex-col gap-8">
          {benefits.map((item, idx) => (
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

          {/* 공통 주의사항도 동일한 카드 포맷으로 적용 */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 px-1">
              <div className="h-2 w-2 rounded-full bg-primary shadow-sm" />
              <h4 className="text-lg font-black tracking-tight text-slate-900">
                섭취 시 주의사항
              </h4>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-base font-bold leading-relaxed text-slate-600 break-keep">
                {pt("MSG_019")}
              </p>
            </div>
          </motion.div>

          {/* 암종별 특별 조언도 동일한 카드 포맷으로 적용 */}
          {diseaseInfo.title && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 px-1">
                <div className="h-2 w-2 rounded-full bg-primary shadow-sm" />
                <h4 className="text-lg font-black tracking-tight text-slate-900">
                  {diseaseInfo.title}
                </h4>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-base font-bold leading-relaxed text-slate-600 break-keep">
                  {diseaseInfo.description}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </CoachingInfoStep>
  );
}
