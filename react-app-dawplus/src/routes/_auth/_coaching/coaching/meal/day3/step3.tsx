import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";
import type { Day3Step3Data } from "./index";

interface Day3Step3Props {
  step1: string[];
  step3: Day3Step3Data;
  onChange: (value: Day3Step3Data) => void;
}

export function Day3Step3({ step1, step3, onChange }: Day3Step3Props) {
  const { pt } = usePageTranslation("coaching/meal/day3");
  const accountName = useAccountName();
  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_025")} />
      <Textbox className="text-center font-bold">{pt("MSG_026")}</Textbox>

      <ChallengeQuestion
        title={pt("MSG_027", { name: accountName })}
        options={step1}
        value={step3.value}
        multiple
        onChange={(value) =>
          onChange({
            value: step3.value.includes(value)
              ? step3.value.filter((item) => item !== value)
              : [...step3.value, value],
          })
        }
      />
    </div>
  );
}
