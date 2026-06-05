import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import MissionInput from "../../-components/elements/MissionInput";
import Textbox from "../../-components/elements/Textbox";

export function Day15Step1(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day15");
  const { step1, setStep1 } = props;
  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="physical">{pt("MSG_005")}</ChallengeStart>
      <Textbox className="text-justify font-semibold text-slate-700">
        {pt("MSG_006")}
        <br />
        {pt("MSG_007")}
      </Textbox>
      <MissionInput value={step1} onChange={setStep1} />
    </div>
  );
}
