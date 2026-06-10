import { usePageTranslation } from "@/hooks/usePageTranslation";
import MissionInput from "../../-components/elements/MissionInput";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day16Step3(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day16");
  const { step3, setStep3 } = props;
  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_038")} />
      <Textbox className="text-center font-semibold">{pt("MSG_039")}</Textbox>
      <Textbox className="text-center font-semibold">{pt("MSG_040")}</Textbox>
      <MissionInput
        value={step3}
        onChange={setStep3}
        placeholder={pt("MSG_041")}
        inputClassName="text-center placeholder:text-center"
      />
      <div className="mt-2 flex flex-col gap-6">
        <Textbox className="text-center font-medium text-slate-600">
          {pt("MSG_042")}
        </Textbox>
        
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="h-1 w-8 rounded-full bg-primary/30" />
          <p className="text-center text-[1.2rem] font-black tracking-tight break-keep leading-relaxed text-primary drop-shadow-sm px-2">
            {pt("MSG_043")}
          </p>
          <div className="h-1 w-8 rounded-full bg-primary/30" />
        </div>
      </div>
    </div>
  );
}
