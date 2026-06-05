import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import type { Day3Step1Data } from "./index";

interface Day3Step1Props {
  step1: Day3Step1Data;
  onChange: (value: Day3Step1Data) => void;
}

export function Day3Step1({ step1, onChange }: Day3Step1Props) {
  const { pt } = usePageTranslation("coaching/meal/day3");
  const accountName = useAccountName();
  const options = [
    pt("MSG_005"),
    pt("MSG_006"),
    pt("MSG_007"),
    pt("MSG_008"),
    pt("MSG_009"),
    pt("MSG_010"),
    pt("MSG_011"),
    pt("MSG_012"),
  ];

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="meal">
        {pt("MSG_013", { name: accountName })}
      </ChallengeStart>

      <ChallengeQuestion
        title={pt("MSG_014")}
        options={options}
        value={step1.value}
        multiple
        onChange={(value) =>
          onChange({
            value: step1.value.includes(value)
              ? step1.value.filter((item) => item !== value)
              : [...step1.value, value],
          })
        }
      />
    </div>
  );
}
