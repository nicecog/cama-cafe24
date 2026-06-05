import { motion } from "framer-motion";
import day1Pic1 from "@/assets/images/coaching/physical/day1_1.png";
import day1Pic2 from "@/assets/images/coaching/physical/day1_2.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day1Step2Props {
  step1Value: string;
}

export function Day1Step2({ step1Value }: Day1Step2Props) {
  const { pt } = usePageTranslation("coaching/physical/day1");
  const isYes = step1Value === pt("step1.option_yes");

  const benefits = [
    { title: pt("step2.body_002_title"), content: pt("step2.body_002") },
    { title: pt("step2.body_003_title"), content: pt("step2.body_003") },
  ];

  return (
    <CoachingInfoStep
      title={pt("step2.title")}
      image={isYes ? day1Pic1 : day1Pic2}
    >
      <div className="flex flex-col gap-10 pt-4 pb-12">
        <div className="mx-auto flex w-full max-w-[28rem] flex-col items-center space-y-3 px-1 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {isYes ? pt("step2.subtitle_yes") : pt("step2.subtitle_no")}
          </h3>
          <p className="mx-auto max-w-[26rem] text-center text-base font-bold text-slate-500 break-keep">
            {pt("step2.body_001")}
          </p>
        </div>

        <div className="flex w-full flex-col gap-10">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex w-full flex-col gap-4"
            >
              <div className="flex items-center gap-3 px-1">
                <div className="h-2 w-2 rounded-full bg-primary shadow-sm" />
                <h4 className="text-lg font-black tracking-tight text-slate-900">
                  {benefit.title}
                </h4>
              </div>

              <div className="w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-100/80">
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
