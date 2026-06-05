import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";
import { getDay12CheckAnswerList } from "./step1";

export interface Day12Step3Data {
  value: string[];
}

interface Day12Step3Props {
  step1: string[];
  step3: Day12Step3Data;
  onChange: (value: Day12Step3Data) => void;
  onSave: () => void;
}

export function Day12Step3({ step1, step3, onChange }: Day12Step3Props) {
  const accountName = useAccountName();
  const { pt } = usePageTranslation("coaching/meal/day12");
  const day12CheckAnswerList = getDay12CheckAnswerList(pt);

  const onClick = (value: string) => {
    onChange({
      value: step3.value.includes(value)
        ? step3.value.filter((item) => item !== value)
        : [...step3.value, value],
    });
  };

  const step3List = day12CheckAnswerList
    .filter((value) => step1.includes(value))
    .map((value) => ({
      value,
      label: value,
    }));

  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_025")} />
      <Textbox className="font-bold text-center">
        <p>{pt("MSG_026", { name: accountName })}</p>
      </Textbox>

      <ChallengeQuestion
        title={pt("MSG_047", { name: accountName })}
        options={step3List}
        value={step3.value}
        multiple
        onChange={onClick}
      />
    </div>
  );
}
