import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

export function Day7Step1(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day7");
  const accountName = useAccountName();
  const { step1, setStep1 } = props;
  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="physical">
        {pt("MSG_005")}
        <br />
        {pt("MSG_006")}
        <br />
        {pt("MSG_007", { name: accountName })}
        <br />
        {pt("MSG_008")}
      </ChallengeStart>
      <ChallengeQuestion
        title={pt("MSG_009")}
        options={[pt("MSG_026"), pt("MSG_027")]}
        value={step1}
        onChange={setStep1}
      />
    </div>
  );
}
