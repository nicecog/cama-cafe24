import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day3Step3() {
  const { pt } = usePageTranslation("coaching/physical/day3");
  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_019")} />
      <Textbox className="text-center font-bold">
        {pt("MSG_020")}
        <br />
        {pt("MSG_021")}
      </Textbox>
    </div>
  );
}
