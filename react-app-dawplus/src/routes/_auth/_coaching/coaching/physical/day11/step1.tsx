import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

export function Day11Step1(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day11");
  const accountName = useAccountName();
  const { step1, setStep1 } = props;
  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="physical">
        {pt("MSG_005")}
        <br />
        {pt("MSG_006", { name: accountName })}
      </ChallengeStart>
      <ChallengeQuestion
        title={pt("MSG_008", { name: accountName })}
        options={[pt("MSG_026"), pt("MSG_027")]}
        value={step1}
        onChange={setStep1}
      />
    </div>
  );
}
