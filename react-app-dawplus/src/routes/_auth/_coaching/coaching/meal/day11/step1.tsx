import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

export interface Day11Step1Data {
  value: string;
}

interface Day11Step1Props {
  data: Day11Step1Data;
  onChange: (value: Day11Step1Data) => void;
}

export function Day11Step1({ data, onChange }: Day11Step1Props) {
  const { pt } = usePageTranslation("coaching/meal/day11");

  const onChangeHandler = (newValue: string) => {
    if (data.value === newValue) return;

    onChange({
      value: newValue,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="meal">{pt("MSG_005")}</ChallengeStart>

      <ChallengeQuestion
        title={pt("MSG_006")}
        options={[pt("MSG_007"), pt("MSG_008")]}
        value={data.value}
        onChange={onChangeHandler}
      />
    </div>
  );
}
