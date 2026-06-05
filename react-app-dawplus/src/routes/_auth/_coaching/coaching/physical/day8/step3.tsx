import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day8Step3() {
  const { pt } = usePageTranslation("coaching/physical/day8");
  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_012")} />
      <Textbox className="text-center">{pt("MSG_013")}</Textbox>
      <Textbox className="text-center">{pt("MSG_014")}</Textbox>
    </div>
  );
}
