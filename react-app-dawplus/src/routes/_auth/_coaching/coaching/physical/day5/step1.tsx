import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import Textbox from "../../-components/elements/Textbox";

export function Day5Step1(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day5");
  const accountName = useAccountName();
  const { step1, setStep1, options } = props;

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="physical">{pt("MSG_005")}</ChallengeStart>
      <Textbox className="text-justify font-semibold text-slate-700">
        {pt("MSG_006")}
      </Textbox>
      <ChallengeQuestion
        title={pt("MSG_007", { name: accountName })}
        options={options}
        value={step1}
        onChange={setStep1}
      />
    </div>
  );
}
