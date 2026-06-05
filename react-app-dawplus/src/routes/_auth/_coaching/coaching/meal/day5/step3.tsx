import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day5Step3() {
  const { pt } = usePageTranslation("coaching/meal/day5");

  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_021")} />
      <Textbox className="text-center font-bold">{pt("MSG_022")}</Textbox>
      <Textbox className="text-center font-bold">{pt("MSG_023")}</Textbox>
    </div>
  );
}
