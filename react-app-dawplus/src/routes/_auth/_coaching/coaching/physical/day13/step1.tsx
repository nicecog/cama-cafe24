import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

export function Day13Step1(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day13");
  const { step1, setStep1 } = props;
  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="physical">
        {pt("MSG_004")}
        <br />
        {pt("MSG_005")}
      </ChallengeStart>
      <ChallengeQuestion
        title={pt("MSG_001")}
        options={[pt("MSG_023"), pt("MSG_024")]}
        value={step1}
        onChange={setStep1}
      />
    </div>
  );
}
