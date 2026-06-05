import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day10Step3() {
  const { pt } = usePageTranslation("coaching/physical/day10");
  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_011")} />
      <Textbox className="text-center">{pt("MSG_012")}</Textbox>
      <Textbox className="text-center">{pt("MSG_013")}</Textbox>
      <Textbox className="text-center font-bold text-primary">
        {pt("MSG_016")}
      </Textbox>
    </div>
  );
}
