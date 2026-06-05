import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

interface Day16Step3Props {
  onSave: () => void;
}

export function Day16Step3(_: Day16Step3Props) {
  const { pt } = usePageTranslation("coaching/meal/day16");

  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_013")} />

      <Textbox className="text-center font-bold">{pt("MSG_014")}</Textbox>
    </div>
  );
}
