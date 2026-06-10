import type { Dispatch, SetStateAction } from "react";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import { ExerciseTypeTimeSelector } from "../../-components/elements/ExerciseTypeTimeSelector";
import Textbox from "../../-components/elements/Textbox";

interface Day14Step1Props {
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

export function Day14Step1({ step1, setStep1 }: Day14Step1Props) {
  const { pt } = usePageTranslation("coaching/physical/day14");

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="physical">{pt("MSG_005")}</ChallengeStart>
      <Textbox className="text-center text-slate-600">{pt("MSG_006")}</Textbox>
      <ExerciseTypeTimeSelector value={step1} onChange={setStep1} />
    </div>
  );
}
