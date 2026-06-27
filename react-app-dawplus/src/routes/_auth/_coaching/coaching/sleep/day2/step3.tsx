import { usePageTranslation } from "@/hooks/usePageTranslation";
import MissionInput from "../../-components/elements/MissionInput";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";
import type { Day2Step3Data } from "./index";

interface Day2Step3Props {
  accountName: string;
  step3: Day2Step3Data;
  onChange: (value: Day2Step3Data) => void;
}

export function Day2Step3({ accountName, step3, onChange }: Day2Step3Props) {
  const { pt } = usePageTranslation("coaching/sleep/day2");

  return (
    <>
      <TodayMission text={pt("step3.msg_001")} />

      <Textbox className="mt-4 font-bold text-center">
        {pt("step3.msg_002")}
        <br />
        {pt("step3.msg_003", { name: accountName })}
      </Textbox>

      <Textbox className="mt-4 text-primary font-bold  text-center">
        {pt("step3.msg_004")}
      </Textbox>

      <MissionInput
        value={step3.value}
        onChange={(value) =>
          onChange({
            value: value.replace(/\D/g, ""),
          })
        }
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={2}
      />
    </>
  );
}
