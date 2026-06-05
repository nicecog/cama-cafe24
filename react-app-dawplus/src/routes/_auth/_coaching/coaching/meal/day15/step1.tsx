import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

interface Day15Step1Props {
  data: string;
  onChange: (value: string) => void;
}

export function Day15Step1({ data, onChange }: Day15Step1Props) {
  const { pt } = usePageTranslation("coaching/meal/day15");

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="meal">{pt("MSG_005")}</ChallengeStart>

      <ChallengeQuestion
        title={pt("MSG_006")}
        options={[pt("MSG_007"), pt("MSG_008")]}
        value={data}
        onChange={onChange}
      />
    </div>
  );
}
