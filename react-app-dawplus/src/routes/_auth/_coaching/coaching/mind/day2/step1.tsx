import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import type { Day2Step1Data } from "./index";

interface Day2Step1Props {
  step1: Day2Step1Data;
  onChange: (value: Day2Step1Data) => void;
}

export function Day2Step1({ step1, onChange }: Day2Step1Props) {
  const { pt } = usePageTranslation("coaching/sleep/day2");

  const onChangeHandler = (newValue: string) => {
    if (step1.value === newValue) return;

    onChange({
      value: newValue,
    });
  };

  return (
    <div>
      <ChallengeStart>{pt("step1.msg_001")}</ChallengeStart>

      <ChallengeQuestion
        title={pt("step1.msg_003")}
        options={[
          pt("step1.msg_004"),
          pt("step1.msg_005"),
          pt("step1.msg_006"),
          pt("step1.msg_007"),
          pt("step1.msg_008"),
        ]}
        value={step1.value}
        onChange={onChangeHandler}
        className="mt-10"
      />
    </div>
  );
}
