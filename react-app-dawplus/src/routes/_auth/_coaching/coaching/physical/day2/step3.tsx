import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day2Step3() {
  const { pt } = usePageTranslation("coaching/physical/day2");

  const msg30 = pt("MSG_030");
  const parts = msg30.includes('"') ? msg30.split('"') : [msg30, "", ""];

  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_028")} />

      <Textbox className="text-center font-bold text-slate-800">
        {pt("MSG_029")}
      </Textbox>

      {parts[1] ? (
        <Textbox className="text-center font-bold text-slate-600 leading-relaxed break-keep">
          <span>{parts[0].trim()}</span>
          <span className="block my-2 text-lg font-black text-primary">
            "{parts[1]}"
          </span>
          <span>{parts[2].trim()}</span>
        </Textbox>
      ) : (
        <Textbox className="text-center text-slate-800">{msg30}</Textbox>
      )}
    </div>
  );
}
