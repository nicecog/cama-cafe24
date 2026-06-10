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
      <div className="flex flex-col gap-2 px-1">
        <Textbox className="text-slate-700 leading-relaxed">
          {pt("MSG_006")}
        </Textbox>
        <Textbox className="text-slate-700 leading-relaxed">
          {pt("MSG_007")}
        </Textbox>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <h3 className="text-center text-[1.1rem] font-bold text-slate-900 break-keep leading-relaxed px-2">
          {pt("MSG_002")}
        </h3>
        <MissionInput value={step1} onChange={setStep1} />
      </div>
    </div>
  );
}
