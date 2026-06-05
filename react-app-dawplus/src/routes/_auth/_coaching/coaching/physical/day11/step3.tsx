import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day11Step3(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day11");
  const { step3, setStep3, options } = props;
  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_019")} />
      <Textbox className="text-center font-bold">{pt("MSG_018")}</Textbox>
      <ChallengeQuestion
        multiple
        title={pt("MSG_018")}
        options={options}
        value={step3}
        centeredOptions
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
