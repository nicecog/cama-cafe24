import { motion } from "framer-motion";
import day4Pic from "@/assets/images/coaching/physical/day4.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { ExercisePlanSummary } from "../../-components/elements/ExercisePlanSummary";
import Textbox from "../../-components/elements/Textbox";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day4Step2Props {
  step1: {
    type: string;
    time: string;
  };
}

export function Day4Step2({ step1 }: Day4Step2Props) {
  const { pt } = usePageTranslation("coaching/physical/day4");

  const headerText = pt("MSG_010").split(" ✔")[0];
  const items = [
    pt("MSG_011").replace("✔ ", ""),
    pt("MSG_012").replace("✔ ", ""),
    pt("MSG_013").replace("✔ ", ""),
  ];

  return (
    <CoachingInfoStep
      title={pt("MSG_009")}
      image={day4Pic}
      subtitle={headerText}
    >
      <Textbox className="flex flex-col gap-4 ">
        {items.map((item, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
          >
            {item}
          </motion.p>
        ))}
        <ExercisePlanSummary type={step1.type} time={step1.time} />
      </Textbox>
    </CoachingInfoStep>
  );
}
