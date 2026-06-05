import { usePageTranslation } from "@/hooks/usePageTranslation";
import MissionInput from "../../-components/elements/MissionInput";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day5Step3(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day5");
  const { step3, setStep3 } = props;
  return (
    <div>
      <TodayMission text={pt("MSG_019")} />
      <Textbox className="text-center font-bold">{pt("MSG_020")}</Textbox>

      <MissionInput
        value={step3}
        onChange={setStep3}
        inputClassName="text-center placeholder:text-center"
        placeholder={pt("MSG_021")}
      />
    </div>
  );
}
