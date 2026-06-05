import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

interface Day7Step3Props {
  onSave: () => void;
}

export function Day7Step3(_: Day7Step3Props) {
  const { pt } = usePageTranslation("coaching/meal/day7");

  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_026")} />
      <Textbox className="text-center font-bold">{pt("MSG_027")}</Textbox>
      <Textbox className="text-center font-bold">{pt("MSG_028")}</Textbox>
    </div>
  );
}
