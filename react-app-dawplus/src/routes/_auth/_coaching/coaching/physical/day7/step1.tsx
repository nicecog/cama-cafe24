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
        <div className="flex flex-col gap-3 text-center text-lg font-bold text-slate-700 leading-relaxed break-keep">
          <p>{pt("MSG_005")}</p>
          <p>{pt("MSG_006")}</p>
          <p>
            <span className="text-primary font-extrabold">{accountName}</span>
            {pt("MSG_007", { name: "" })}
          </p>
          <p className="text-slate-500 font-semibold mt-1">
            {pt("MSG_008")}
          </p>
        </div>
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
