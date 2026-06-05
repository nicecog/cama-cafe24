import { useAtomValue } from "jotai";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useUserAnswerInfoList } from "@/hooks/queries";
import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

interface Day4Step3Props {
  step3: string[];
  onChange: (value: string[]) => void;
  onSave: () => void;
}

export function Day4Step3({ step3, onChange }: Day4Step3Props) {
  const { pt } = usePageTranslation("coaching/meal/day4");
  const { pt: day3Pt } = usePageTranslation("coaching/meal/day3");
  const accountMe = useAtomValue(accountMeAtom);
  const accountName = useAccountName();
  const loginId = accountMe.data?.loginId ?? "";

  const { data: answerList = [] } = useUserAnswerInfoList({
    loginId,
    categoryCd: "B",
  });

  const previousDayAnswers = answerList
    .filter((item) => item.stepDayCd === "03" && item.progressTypeCd === "A1")
    .map((item) => item.answerChoice)
    .filter((item): item is string => Boolean(item));

  const previousDayOptionTexts = [
    day3Pt("MSG_005"),
    day3Pt("MSG_006"),
    day3Pt("MSG_007"),
    day3Pt("MSG_008"),
    day3Pt("MSG_009"),
    day3Pt("MSG_010"),
    day3Pt("MSG_011"),
    day3Pt("MSG_012"),
  ];
  const options = previousDayOptionTexts.filter((item) =>
    previousDayAnswers.includes(item),
  );

  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("MSG_014")} />
      <Textbox className="text-center font-bold ">
        <p>{pt("MSG_062")}</p>
      </Textbox>

      <ChallengeQuestion
        title={pt("MSG_015", { name: accountName })}
        options={options}
        value={step3}
        multiple
        onChange={(value) =>
          onChange(
            step3.includes(value)
              ? step3.filter((item) => item !== value)
              : [...step3, value],
          )
        }
      />
    </div>
  );
}
