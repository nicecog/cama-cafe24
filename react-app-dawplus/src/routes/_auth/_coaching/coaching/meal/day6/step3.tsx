import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

interface Day6Step3Props {
  onSave: () => void;
}

export function Day6Step3(_: Day6Step3Props) {
  const { pt } = usePageTranslation("coaching/meal/day6");

  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_018")} />
      <Textbox className="text-center font-bold">{pt("MSG_044")}</Textbox>
      <Textbox className="text-center font-bold">{pt("MSG_045")}</Textbox>
    </div>
  );
}
