import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

interface Day5Step1Props {
  step1: string;
  onChange: (value: string) => void;
}

export function Day5Step1({ step1, onChange }: Day5Step1Props) {
  const { pt } = usePageTranslation("coaching/meal/day5");
  const accountName = useAccountName();

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="meal">{pt("MSG_005")}</ChallengeStart>

      <ChallengeQuestion
        title={pt("MSG_006", { name: accountName })}
        options={[pt("MSG_007"), pt("MSG_008")]}
        value={step1}
        onChange={onChange}
      />
    </div>
  );
}
