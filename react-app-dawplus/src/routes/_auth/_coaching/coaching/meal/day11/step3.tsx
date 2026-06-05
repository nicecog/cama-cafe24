import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export interface Day11Step3Data {
  value: string[];
}

interface Day11Step3Props {
  step3: Day11Step3Data;
  onChange: (value: Day11Step3Data) => void;
  onSave: () => void;
}

export function Day11Step3({ step3, onChange }: Day11Step3Props) {
  const accountName = useAccountName();
  const { pt } = usePageTranslation("coaching/meal/day11");
  const checkAnswerList = [
    pt("MSG_051"),
    pt("MSG_052"),
    pt("MSG_053"),
    pt("MSG_054"),
    pt("MSG_055"),
    pt("MSG_056"),
    pt("MSG_057"),
    pt("MSG_058"),
  ].map((value) => ({
    value,
    label: value,
  }));

  const onClick = (value: string) => {
    onChange({
      value: step3.value.includes(value)
        ? step3.value.filter((item) => item !== value)
        : [...step3.value, value],
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <TodayMission text={pt("MSG_021")} />
      <Textbox className="text-center font-bold">{pt("MSG_034")}</Textbox>

      <ChallengeQuestion
        title={pt("MSG_035", { name: accountName })}
        options={checkAnswerList}
        value={step3.value}
        multiple
        onChange={onClick}
      />
    </div>
  );
}
