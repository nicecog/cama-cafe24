import startPic from "@/assets/images/coaching/physical/day0.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day0Step2() {
  const { pt } = usePageTranslation("coaching/physical/day0");

  return (
    <CoachingInfoStep
      title={pt("MSG_007")}
      image={startPic}
      subtitle={pt("MSG_008")}
    >
      <Textbox className="">
        {pt("MSG_009")}
        <br />
        <br />
        {pt("MSG_010")}
      </Textbox>
    </CoachingInfoStep>
  );
}
