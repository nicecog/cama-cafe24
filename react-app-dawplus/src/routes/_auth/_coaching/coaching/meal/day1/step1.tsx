import { Info } from "lucide-react";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import Textbox from "../../-components/elements/Textbox";
import type { Day1Step1Data } from "./index";

interface Day1Step1Props {
  step1: Day1Step1Data;
  onChange: (value: Day1Step1Data) => void;
  accountName: string;
}

export function Day1Step1({ step1, onChange }: Day1Step1Props) {
  const { pt } = usePageTranslation("coaching/meal/day1");

  const onChangeHandler = (newValue: string) => {
    if (step1.value === newValue) return;

    onChange({
      value: newValue,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="meal">
        {pt("MSG_002")}
        {pt("MSG_003")}

        <div className="mt-3 flex flex-col items-center gap-2 border-t border-slate-50 pt-4">
          <Info size={20} className="text-slate-400" />
          <Textbox className="text-center  leading-relaxed text-slate-500">
            {pt("MSG_104")}
          </Textbox>
        </div>
      </ChallengeStart>

      <ChallengeQuestion
        title={pt("MSG_004")}
        options={[pt("MSG_005"), pt("MSG_006")]}
        value={step1.value}
        onChange={onChangeHandler}
      />
    </div>
  );
}
