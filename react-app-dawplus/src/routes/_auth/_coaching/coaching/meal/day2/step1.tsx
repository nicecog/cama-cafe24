import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import type { Day2Step1Data } from "./index";

interface Day2Step1Props {
  step1: Day2Step1Data;
  onChange: (value: Day2Step1Data) => void;
}

export function Day2Step1({ step1, onChange }: Day2Step1Props) {
  const { pt } = usePageTranslation("coaching/meal/day2");
  const accountName = useAccountName();
  const onChangeHandler = (newValue: string) => {
    if (step1.value === newValue) return;

    onChange({
      value: newValue,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="meal">{pt("MSG_005")}</ChallengeStart>

      <ChallengeQuestion
        title={pt("MSG_006", { name: accountName })}
        options={[pt("MSG_007"), pt("MSG_008")]}
        value={step1.value}
        onChange={onChangeHandler}
      />
    </div>
  );
}
