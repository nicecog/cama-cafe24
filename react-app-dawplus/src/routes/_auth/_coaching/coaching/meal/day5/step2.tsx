import { motion } from "framer-motion";
import day5Pic from "@/assets/images/coaching/meal/day5/day5.png";
import { useConditionalStepAlert } from "@/hooks/useConditionalStepAlert";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day5Step2Props {
  step1Value: string;
  shouldShowAlert: boolean;
}

export function Day5Step2({ step1Value, shouldShowAlert }: Day5Step2Props) {
  const { pt } = usePageTranslation("coaching/meal/day5");
  const isYes = step1Value.trim() === pt("MSG_007");

  const advices = [
    { title: pt("MSG_014"), description: pt("MSG_026") },
    { title: pt("MSG_015"), description: pt("MSG_027") },
    { title: pt("MSG_016"), description: pt("MSG_028") },
    { title: pt("MSG_017"), description: pt("MSG_029") },
    { title: pt("MSG_018"), description: pt("MSG_030") },
    { title: pt("MSG_019"), description: pt("MSG_031") },
  ];

  useConditionalStepAlert(
    shouldShowAlert
      ? [
          {
            when: isYes,
            title: pt("MSG_034"),
            body: pt("MSG_035"),
          },
          {
            when: !isYes,
            title: pt("MSG_036"),
            body: pt("MSG_037"),
          },
        ]
      : [],
  );

  return (
    <CoachingInfoStep title={pt("MSG_010")} image={day5Pic}>
      <div className="flex flex-col gap-10 pt-4">
        <div className="space-y-8">
          <div className="flex flex-col gap-2 px-1">
            <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
              {pt("MSG_011")}
            </h3>
            <p className="text-base font-bold text-slate-500 break-keep">
              {pt("MSG_012")}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {advices.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
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

        <div className="rounded-3xl bg-slate-50 p-8 text-center border border-slate-100">
          <p className="text-base font-bold text-slate-700 break-keep leading-relaxed">
            {pt("MSG_020")}
          </p>
        </div>
      </div>
    </CoachingInfoStep>
  );
}
