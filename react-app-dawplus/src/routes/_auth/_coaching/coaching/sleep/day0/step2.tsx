import { Trans } from "react-i18next";
import startPic from "@/assets/images/coaching/sleep/day0/startPic.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day0Step2() {
  const { pt } = usePageTranslation("coaching/sleep/day0");

  return (
    <CoachingInfoStep
      image={startPic}
      subtitle={
        <Trans
          i18nKey="step2.subtitle"
          ns="coaching/sleep/day0"
          components={[
            <span key="subtitle-emphasis" className="text-primary" />,
          ]}
        />
      }
    >
      {pt("step2.body")}
    </CoachingInfoStep>
  );
}
