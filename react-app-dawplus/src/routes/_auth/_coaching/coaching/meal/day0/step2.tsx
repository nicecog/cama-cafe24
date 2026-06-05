import { josa } from "es-hangul";
import { motion } from "framer-motion";
import { Trans } from "react-i18next";
import startPic from "@/assets/images/coaching/meal/day0/day0.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";
import type { Day0Step1Data } from "./index";

interface Day0Step2Props {
  step1: Day0Step1Data;
}

export function Day0Step2({ step1 }: Day0Step2Props) {
  const { pt } = usePageTranslation("coaching/meal/day0");
  const selectedText = step1.extra.trim() || step1.value.trim();

  return (
    <CoachingInfoStep
      image={startPic}
      subtitle={
        <Trans
          i18nKey="step2.subtitle"
          ns="coaching/meal/day0"
          components={[
            <span key="subtitle-emphasis" className="text-primary" />,
          ]}
        />
      }
    >
      <div className="mb-5 space-y-2 text-center ">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl font-extrabold leading-tight tracking-tight text-slate-800"
        >
          <span className="relative z-10 text-primary mr-1">
            {josa(selectedText, "을/를")}
          </span>
          실현하는 것에 <br />
          식사습관은 어떤 기여를 하게 될까요?
        </motion.h3>
      </div>

      <Textbox className="">
        {pt("step2.msg_001")}

        <br />
        {pt("step2.msg_002")}

        <br />
        {pt("step2.msg_003")}
      </Textbox>
    </CoachingInfoStep>
  );
}
