import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day2Step3() {
  const { pt } = usePageTranslation("coaching/meal/day2");

  return (
    <div>
      <TodayMission text={pt("MSG_019")} />
      <Textbox className="mt-4 text-center font-bold">{pt("MSG_020")}</Textbox>
    </div>
  );
}
