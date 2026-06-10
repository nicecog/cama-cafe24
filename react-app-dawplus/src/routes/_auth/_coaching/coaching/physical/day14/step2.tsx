import { motion } from "framer-motion";
import day14Pic from "@/assets/images/coaching/physical/day14.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { ExercisePlanSummary } from "../../-components/elements/ExercisePlanSummary";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";
import Textbox from "../../-components/elements/Textbox";

interface Day14Step2Props {
  step1: {
    type: string;
    time: string;
  };
}

export function Day14Step2({ step1 }: Day14Step2Props) {
  const { pt } = usePageTranslation("coaching/physical/day14");
  const bodies = [pt("MSG_010"), pt("MSG_011")];
  return (
    <CoachingInfoStep
      title={pt("MSG_008")}
      image={day14Pic}
      subtitle={pt("MSG_009")}
    >
      <div className="flex flex-col gap-10 pt-4 pb-12">
        <div className="flex flex-col gap-4">
          {bodies.map((body) => (
            <Textbox key={body}>
              <p className="text-base font-bold leading-relaxed text-slate-600 break-keep">
                {body}
              </p>
            </Textbox>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-2"
        >
          <ExercisePlanSummary type={step1.type} time={step1.time} />
        </motion.div>
      </div>
    </CoachingInfoStep>
  );
}
