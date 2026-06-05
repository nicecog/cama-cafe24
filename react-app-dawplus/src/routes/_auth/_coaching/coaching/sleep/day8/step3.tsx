import { usePageTranslation } from "@/hooks/usePageTranslation";
import MissionInput from "../../-components/elements/MissionInput";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

interface Day8Step3Props {
  value: string;
  onChange: (value: string) => void;
}

export function Day8Step3({ value, onChange }: Day8Step3Props) {
  const { pt } = usePageTranslation("coaching/sleep/day8");

  return (
    <div>
      <TodayMission text={pt("step3.msg_001")} />
      <Textbox className="mt-4 text-center">{pt("step3.msg_002")}</Textbox>
      <Textbox className="mt-4 text-center">{pt("step3.msg_003")}</Textbox>
      <MissionInput
        value={value}
        onChange={onChange}
        example={pt("step3.msg_006")}
      />
    </div>
  );
}
