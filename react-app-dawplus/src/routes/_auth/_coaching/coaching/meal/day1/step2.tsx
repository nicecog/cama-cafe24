import { motion } from "framer-motion";
import day1Pic from "@/assets/images/coaching/meal/day1/day1.png";
import { useConditionalStepAlert } from "@/hooks/useConditionalStepAlert";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day1Step2Props {
  step1Value: string;
  shouldShowAlert: boolean;
}

export function Day1Step2({ step1Value, shouldShowAlert }: Day1Step2Props) {
  const { pt } = usePageTranslation("coaching/meal/day1");
  const yesText = pt("MSG_005");
  const isYes = step1Value.trim() === yesText;

  useConditionalStepAlert(
    shouldShowAlert
      ? [
          {
            when: isYes,
            title: "좋습니다!",
            body: "카마코치와 함께 건강한 식사습관을 만들어 보아요!",
          },
          {
            when: !isYes,
            title: "아직 준비가 안되셨군요.",
            body: "건강한 식습관이 왜 중요한지, 카마코치와 함께 생각해 볼게요.",
          },
        ]
      : [],
  );

  const reasons = [
    { num: 12, title: pt("MSG_012_title"), description: pt("MSG_012") },
    { num: 13, title: pt("MSG_013_title"), description: pt("MSG_013") },
    { num: 14, title: pt("MSG_014_title"), description: pt("MSG_014") },
    { num: 15, title: pt("MSG_015_title"), description: pt("MSG_015") },
    { num: 16, title: pt("MSG_016_title"), description: pt("MSG_016") },
  ];

  return (
    <CoachingInfoStep title={pt("MSG_008")} image={day1Pic}>
      <div className="space-y-8 pt-4">
        <div className="flex flex-col items-center gap-3 px-2 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep leading-snug">
            {pt("MSG_009")}
          </h3>
          <p className="text-[15px] font-bold leading-relaxed text-slate-500 break-keep">
            {pt("MSG_010")}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {reasons.map((item, idx) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2.5 px-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary font-black text-xs text-white shadow-md shadow-primary/20">
                  {idx + 1}
                </div>
                <h4 className="text-base font-black tracking-tight text-slate-900">
                  {item.title}
                </h4>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-[15px] font-semibold leading-relaxed text-slate-600 break-keep">
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
