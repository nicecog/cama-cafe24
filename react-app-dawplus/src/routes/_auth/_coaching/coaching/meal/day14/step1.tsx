import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

interface Day14Step1Props {
  data: string;
  onChange: (value: string) => void;
}

export function Day14Step1({ data, onChange }: Day14Step1Props) {
  const accountName = useAccountName();
  const { pt } = usePageTranslation("coaching/meal/day14");

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="meal" title={`${pt("MSG_005")}`}>
        {pt("MSG_031")}
      </ChallengeStart>

      <ChallengeQuestion
        title={pt("MSG_006", { name: accountName })}
        options={[pt("MSG_007"), pt("MSG_008")]}
        value={data}
        onChange={onChange}
      />
    </div>
  );
}
