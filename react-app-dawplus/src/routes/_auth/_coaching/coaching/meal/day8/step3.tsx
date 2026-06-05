import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

interface Day8Step3Props {
  onSave: () => void;
}

export function Day8Step3(_: Day8Step3Props) {
  const { pt } = usePageTranslation("coaching/meal/day8");

  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_030")} />
      <Textbox className="text-center font-bold">{pt("MSG_031")}</Textbox>
      <Textbox className="text-center font-bold">{pt("MSG_032")}</Textbox>
    </div>
  );
}
