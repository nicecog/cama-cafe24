import { usePageTranslation } from "@/hooks/usePageTranslation";
import MissionInput from "../../-components/elements/MissionInput";
import { PercentageSlider } from "../../-components/elements/PercentageSlider";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";
import type { Day0Step1Data, Day0Step3Data } from "./index";

interface Day0Step3Props {
  accountName: string;
  step1: Day0Step1Data;
  step3: Day0Step3Data;
  onChange: (value: Day0Step3Data) => void;
}

export function Day0Step3({ accountName, step3, onChange }: Day0Step3Props) {
  const { pt } = usePageTranslation("coaching/physical/day0");

  return (
    <>
      <TodayMission text={pt("MSG_011")} />

      <Textbox className="mt-4 text-center">
        {pt("MSG_013")}
        <br />
      </Textbox>

      <PercentageSlider
        className="mt-4"
        value={step3.value1}
        onChange={(value1) => {
          onChange({
            ...step3,
            value1,
          });
        }}
        label={pt("MSG_014", { name: accountName })}
      />
      <Textbox className="mt-8 text-center font-bold">
        {pt("MSG_017")}
        <p className="text-sm font-semibold  text-center">{pt("MSG_016")}</p>
      </Textbox>

      <MissionInput
        value={step3.value2}
        onChange={(value) =>
          onChange({
            ...step3,
            value2: value,
          })
        }
        inputClassName="text-center placeholder:text-center"
      />
      <Textbox className="mt-4 text-center">{pt("MSG_018")}</Textbox>
    </>
  );
}
