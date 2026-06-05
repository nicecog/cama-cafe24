import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

export function Day16Step1(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day16");
  const { step1, setStep1, answers } = props;
  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart
        type="physical"
        title={<p className="text-center">🎉 {pt("MSG_018")} 🎉</p>}
      >
        {pt("MSG_009")}
      </ChallengeStart>

      <ChallengeQuestion
        title={pt("MSG_009")}
        options={answers}
        value={step1}
        onChange={setStep1}
      />
    </div>
  );
}
