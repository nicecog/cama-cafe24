import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export interface Day10Step3Data {
  value: string[];
}

interface Day10Step3Props {
  step3: Day10Step3Data;
  onChange: (value: Day10Step3Data) => void;
  onSave: () => void;
}

export function Day10Step3({ step3, onChange }: Day10Step3Props) {
  const accountName = useAccountName();
  const { pt } = usePageTranslation("coaching/meal/day10");
  const checkAnswerList = [
    pt("MSG_011"),
    pt("MSG_012"),
    pt("MSG_013"),
    pt("MSG_014"),
    pt("MSG_015"),
    pt("MSG_016"),
    pt("MSG_017"),
    pt("MSG_018"),
    pt("MSG_019"),
    pt("MSG_020"),
    pt("MSG_021"),
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
      <TodayMission text={pt("MSG_024")} />
      <Textbox className="text-center font-bold">{pt("MSG_039")}</Textbox>

      <ChallengeQuestion
        title={pt("MSG_040", { name: accountName })}
        options={checkAnswerList}
        value={step3.value}
        multiple
        onChange={onClick}
      />
    </div>
  );
}
