import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day6Step3() {
  const { pt } = usePageTranslation("coaching/physical/day6");
  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_012")} />
      <Textbox className="text-center font-semibold">{pt("MSG_013")}</Textbox>
    </div>
  );
}
