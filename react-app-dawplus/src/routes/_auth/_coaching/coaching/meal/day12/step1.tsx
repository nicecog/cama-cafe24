import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

export const getDay12CheckAnswerList = (
  pt: (key: string, params?: Record<string, string>) => string,
) => [
  pt("MSG_005"),
  pt("MSG_006"),
  pt("MSG_007"),
  pt("MSG_008"),
  pt("MSG_009"),
  pt("MSG_010"),
  pt("MSG_011"),
  pt("MSG_012"),
];

export interface Day12Step1Data {
  value: string[];
}

interface Day12Step1Props {
  data: Day12Step1Data;
  onChange: (value: Day12Step1Data) => void;
}

export function Day12Step1({ data, onChange }: Day12Step1Props) {
  const accountName = useAccountName();
  const { pt } = usePageTranslation("coaching/meal/day12");
  const checkAnswerList = getDay12CheckAnswerList(pt).map((value) => ({
    value,
    label: value,
  }));

  const onClick = (value: string) => {
    onChange({
      value: data.value.includes(value)
        ? data.value.filter((item) => item !== value)
        : [...data.value, value],
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="meal">{pt("MSG_013")}</ChallengeStart>

      <p className="text-center w-full -mb-2 text-primary">{pt("MSG_050")}</p>

      <ChallengeQuestion
        title={pt("MSG_014", { name: accountName })}
        options={checkAnswerList}
        value={data.value}
        multiple
        onChange={onClick}
      />
    </div>
  );
}
