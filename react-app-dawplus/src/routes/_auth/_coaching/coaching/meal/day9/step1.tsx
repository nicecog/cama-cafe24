import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

export interface Day9Step1Data {
  value: string;
}

interface Day9Step1Props {
  data: Day9Step1Data;
  onChange: (value: Day9Step1Data) => void;
}

export function Day9Step1({ data, onChange }: Day9Step1Props) {
  const { pt } = usePageTranslation("coaching/meal/day9");

  const onChangeHandler = (newValue: string) => {
    if (data.value === newValue) return;

    onChange({
      value: newValue,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="meal">
        {pt("MSG_005")}
        {pt("MSG_031")}
      </ChallengeStart>

      <ChallengeQuestion
        title={pt("MSG_006")}
        options={[pt("MSG_007"), pt("MSG_008")]}
        value={data.value}
        onChange={onChangeHandler}
      />
    </div>
  );
}
