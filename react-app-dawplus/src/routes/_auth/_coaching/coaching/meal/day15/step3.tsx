import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

interface Day15Step3Props {
  onSave: () => void;
}

export function Day15Step3(_: Day15Step3Props) {
  const { pt } = usePageTranslation("coaching/meal/day15");

  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_024")} />

      <Textbox className="text-center font-extrabold text-lg text-slate-700">
        {pt("MSG_025")}
      </Textbox>
      <Textbox className="text-center font-extrabold text-lg text-slate-700">
        {pt("MSG_026")}
      </Textbox>
    </div>
  );
}
