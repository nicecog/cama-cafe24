import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

export function Day9Step1(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day9");
  const accountName = useAccountName();
  const { step1, setStep1 } = props;
  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="physical">
        {pt("MSG_005", { name: accountName })}
        <br />
        {pt("MSG_006")}
      </ChallengeStart>
      <ChallengeQuestion
        title={pt("MSG_007")}
        options={[pt("MSG_011"), pt("MSG_024")]}
        value={step1}
        onChange={setStep1}
      />
    </div>
  );
}
