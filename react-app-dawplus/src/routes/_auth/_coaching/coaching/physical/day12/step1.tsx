import type { Dispatch, SetStateAction } from "react";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import { ExerciseTypeTimeSelector } from "../../-components/elements/ExerciseTypeTimeSelector";

interface Day12Step1Props {
  step1: {
    type: string;
    time: string;
  };
  setStep1: Dispatch<
    SetStateAction<{
      type: string;
      time: string;
    }>
  >;
}

export function Day12Step1({ step1, setStep1 }: Day12Step1Props) {
  const { pt } = usePageTranslation("coaching/physical/day12");

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="physical">{pt("MSG_003")}</ChallengeStart>
      <ExerciseTypeTimeSelector value={step1} onChange={setStep1} />
    </div>
  );
}
