import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day12Step3() {
  const { pt } = usePageTranslation("coaching/physical/day12");
  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_014")} />
      <Textbox className="text-center">{pt("MSG_015")}</Textbox>
      <Textbox className="text-center">{pt("MSG_016")}</Textbox>
    </div>
  );
}
