import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export interface Day9Step3Data {
  value: string[];
}

interface Day9Step3Props {
  step3: Day9Step3Data;
  onChange: (value: Day9Step3Data) => void;
  onSave: () => void;
}

export function Day9Step3({ step3, onChange }: Day9Step3Props) {
  const { pt } = usePageTranslation("coaching/meal/day9");
  const checkAnswerList = [
    pt("MSG_024"),
    pt("MSG_025"),
    pt("MSG_026"),
    pt("MSG_027"),
    pt("MSG_028"),
    pt("MSG_029"),
    pt("MSG_030"),
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
      <Textbox className="text-center font-bold">{pt("MSG_043")}</Textbox>

      <ChallengeQuestion
        title={pt("MSG_022")}
        options={checkAnswerList}
        value={step3.value}
        multiple
        onChange={onClick}
      />
    </div>
  );
}
