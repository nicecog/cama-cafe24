import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

export function Day3Step1(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day3");
  const accountName = useAccountName();
  const { step1, setStep1, options } = props;

  const onToggleOption = (option: string) => {
    setStep1((prev: string[]) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="physical">
        {pt("MSG_011", { name: accountName })}
        {pt("MSG_012", { name: accountName })}
      </ChallengeStart>

      <ChallengeQuestion
        title={`${pt("MSG_013", { name: accountName })}`}
        options={options}
        value={step1}
        multiple
        onChange={onToggleOption}
      />
    </div>
  );
}
