import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

interface Day7Step1Props {
  step1: string;
  onChange: (value: string) => void;
}

export function Day7Step1({ step1, onChange }: Day7Step1Props) {
  const accountName = useAccountName();
  const { pt } = usePageTranslation("coaching/meal/day7");

  return (
    <div>
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
