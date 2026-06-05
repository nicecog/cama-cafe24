import { usePageTranslation } from "@/hooks/usePageTranslation";
import MissionInput from "../../-components/elements/MissionInput";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day14Step3(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day14");
  const { step3, setStep3 } = props;
  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_013")} />
      <Textbox className="text-center">{pt("MSG_014")}</Textbox>
      <MissionInput
        value={step3}
        onChange={setStep3}
        placeholder={pt("MSG_015")}
        inputClassName="text-center placeholder:text-center"
      />
      <Textbox className="text-center">{pt("MSG_016")}</Textbox>
    </div>
  );
}
