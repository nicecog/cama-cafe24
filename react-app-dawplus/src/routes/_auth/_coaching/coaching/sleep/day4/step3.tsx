import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day4Step3() {
  const { pt } = usePageTranslation("coaching/sleep/day4");

  return (
    <>
      <TodayMission text={pt("step3.msg_001")} />

      <Textbox className="mt-4 text-center">
        <span className="block">{pt("step3.msg_002")}</span>
        <span className="block">{pt("step3.msg_003")}</span>
      </Textbox>

      <Textbox className="mt-4 text-center">{pt("step3.msg_004")}</Textbox>
    </>
  );
}
