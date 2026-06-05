import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

import type { Day1Step1Data } from "./index";

interface Day1Step1Props {
  step1: Day1Step1Data;
  onChange: (value: Day1Step1Data) => void;
  accountName: string;
}

export function Day1Step1({ step1, onChange, accountName }: Day1Step1Props) {
  const { pt } = usePageTranslation("coaching/physical/day1");

  const onChangeHandler = (newValue: string) => {
    if (step1.value === newValue) return;

    onChange({
      value: newValue,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="physical">
        {pt("step1.description_001")}
        {pt("step1.description_002")}
      </ChallengeStart>

      <ChallengeQuestion
        title={pt("step1.title", { name: accountName })}
        options={[pt("step1.option_yes"), pt("step1.option_no")]}
        value={step1.value}
        onChange={onChangeHandler}
      />
    </div>
  );
}
