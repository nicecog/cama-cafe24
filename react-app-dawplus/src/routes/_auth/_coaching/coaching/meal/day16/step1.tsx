import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";

interface Day16Step1Props {
  answerList: string[];
  data: number | null;
  onChange: (value: number | null) => void;
}

export function Day16Step1({ answerList, data, onChange }: Day16Step1Props) {
  const { pt } = usePageTranslation("coaching/meal/day16");

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart
        type="meal"
        title={<p className="text-center">🎉 {pt("MSG_015")} 🎉</p>}
      >
        {pt("MSG_002")}
      </ChallengeStart>

      <ChallengeQuestion
        title={pt("MSG_016")}
        options={answerList.map((_item, index) => ({
          value: String(index),
          label:
            index === 0
              ? pt("MSG_005")
              : index === 1
                ? pt("MSG_006")
                : index === 2
                  ? pt("MSG_007")
                  : pt("MSG_008"),
        }))}
        value={data === null ? "" : String(data)}
        onChange={(value) => onChange(Number(value))}
      />
    </div>
  );
}
