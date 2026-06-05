import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

export interface Day10Step1Data {
  value: string;
}

interface Day10Step1Props {
  data: Day10Step1Data;
  onChange: (value: Day10Step1Data) => void;
}

export function Day10Step1({ data, onChange }: Day10Step1Props) {
  const { pt } = usePageTranslation("coaching/meal/day10");

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
