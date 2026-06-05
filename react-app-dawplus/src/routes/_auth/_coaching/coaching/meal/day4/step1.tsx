import { useAtomValue } from "jotai";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useUserAnswerInfoList } from "@/hooks/queries";
import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import Textbox from "../../-components/elements/Textbox";

interface Day4Step1Props {
  step1: string;
  onChange: (value: string) => void;
}

export function Day4Step1({ step1, onChange }: Day4Step1Props) {
  const { pt } = usePageTranslation("coaching/meal/day4");
  const accountName = useAccountName();
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const { data: answerList = [] } = useUserAnswerInfoList({
    loginId,
    categoryCd: "B",
  });

  const previousDayAnswers = answerList
    .filter((item) => item.stepDayCd === "03" && item.progressTypeCd === "A1")
    .map((item) => item.answerChoice)
    .filter((item): item is string => Boolean(item));

  return (
    <div className="flex flex-col gap-3">
      <ChallengeStart type="meal">{pt("MSG_002")}</ChallengeStart>

      <Textbox className="rounded-[2.5rem] bg-slate-50/50 p-2 text-center ">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="h-px w-4 bg-slate-200" />
            <p className="text-sm font-bold text-slate-400">
              {pt("MSG_005", { name: accountName })}
            </p>
            <div className="h-px w-4 bg-slate-200" />
          </div>

          <div className="flex flex-col items-center gap-2">
            {previousDayAnswers.map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center gap-3">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-lg font-bold text-slate-500">{pt("MSG_013")}</p>
          </div>
        </div>
      </Textbox>
      <ChallengeQuestion
        title={pt("MSG_006")}
        options={[pt("MSG_007"), pt("MSG_008")]}
        value={step1}
        onChange={onChange}
      />
    </div>
  );
}
