import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import TodayMission from "../../-components/elements/TodayMission";

export function Day7Step3(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day7");
  const { step3, setStep3, options } = props;
  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_024")} />

      <ChallengeQuestion
        multiple
        title={pt("MSG_025")}
        options={options}
        value={step3}
        onChange={(value) =>
          setStep3((prev: string[]) =>
            prev.includes(value)
              ? prev.filter((item) => item !== value)
              : [...prev, value],
          )
        }
      />
    </div>
  );
}
