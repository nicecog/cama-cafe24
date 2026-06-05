import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day16Step3() {
  const { pt } = usePageTranslation("coaching/sleep/day16");

  return (
    <div>
      <TodayMission text={pt("step3.msg_001")} />
      <Textbox className="mt-4 text-center">{pt("step3.msg_002")}</Textbox>
      <Textbox className="mt-4 text-center">{pt("step3.msg_003")}</Textbox>
    </div>
  );
}
