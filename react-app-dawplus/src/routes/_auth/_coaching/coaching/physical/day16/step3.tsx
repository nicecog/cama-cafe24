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
      <Textbox className="text-center">{pt("MSG_039")}</Textbox>
      <Textbox className="text-center">{pt("MSG_040")}</Textbox>
      <MissionInput
        value={step3}
        onChange={setStep3}
        placeholder={pt("MSG_041")}
        inputClassName="text-center placeholder:text-center"
      />
      <Textbox className="text-center">{pt("MSG_042")}</Textbox>
      <Textbox className="text-center font-bold">{pt("MSG_043")}</Textbox>
    </div>
  );
}
