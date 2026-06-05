import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import SleepWakeupCheck from "../../-components/elements/SleepWakeupCheck";
import type { Day3Step1Data } from "./utils";

interface Day3Step1Props {
  data: Day3Step1Data;
  onChange: (value: Day3Step1Data) => void;
}

export function Day3Step1({ data, onChange }: Day3Step1Props) {
  const { pt } = usePageTranslation("coaching/sleep/day3");

  const onChangeHandler = (
    name: "sleep" | "wakeup",
    value: Day3Step1Data["sleep"],
  ) => {
    onChange({
      ...data,
      [name]: value,
    });
  };

  return (
    <>
      <ChallengeStart>{pt("step1.msg_001")}</ChallengeStart>

      <SleepWakeupCheck
        className="mt-10"
        data={data}
        onChange={onChangeHandler}
      />
    </>
  );
}
