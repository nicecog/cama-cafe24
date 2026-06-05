import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import SleepCheck from "../../-components/elements/SleepCheck";
import type { Day4Step1Data } from "./utils";

interface Day4Step1Props {
  step1: Day4Step1Data;
  onChange: (value: Day4Step1Data) => void;
}

export function Day4Step1({ step1, onChange }: Day4Step1Props) {
  const { pt } = usePageTranslation("coaching/sleep/day4");

  const onChangeHandler = (nextValue: Partial<Day4Step1Data>) => {
    onChange({
      ...step1,
      ...nextValue,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart>{pt("step1.msg_001")}</ChallengeStart>

      <SleepCheck
        sleepTitle={pt("step1.msg_002")}
        sleepHint={pt("step1.msg_003")}
        ratingTitle={pt("step1.msg_004")}
        ratingHint={pt("step1.msg_005")}
        sleep={step1.sleep}
        rating={step1.rating}
        onChange={onChangeHandler}
      />
    </div>
  );
}
