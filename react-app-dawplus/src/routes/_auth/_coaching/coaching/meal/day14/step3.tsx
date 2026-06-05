import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day14Step3() {
  const { pt } = usePageTranslation("coaching/meal/day14");

  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_024")} />

      <Textbox className="text-center font-extrabold text-lg text-slate-700">
        {pt("MSG_025")}
      </Textbox>
    </div>
  );
}
