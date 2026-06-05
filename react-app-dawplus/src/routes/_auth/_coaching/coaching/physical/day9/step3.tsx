import { usePageTranslation } from "@/hooks/usePageTranslation";
import MissionInput from "../../-components/elements/MissionInput";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day9Step3(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day9");
  const { step3, setStep3 } = props;
  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_021")} />
      <Textbox className="text-center font-bold">{pt("MSG_022")}</Textbox>
      <MissionInput
        value={step3}
        onChange={setStep3}
        placeholder={pt("MSG_023")}
        inputClassName="text-center placeholder:text-center"
      />
    </div>
  );
}
