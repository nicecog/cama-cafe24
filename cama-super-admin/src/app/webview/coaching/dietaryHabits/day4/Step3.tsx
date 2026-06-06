import useGetAnswer from "@/hooks/useGetAnswer";

import { checkAnswerList } from "../index";
import CheckAnswers from "../../component/Layout/CheckAnswers";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "../../component/Layout/TextArea";
import useAccountName from "@/hooks/useAccountName";

export default function Day4Step3(props: any) {
  const { onSave, step3, onChange, setProgressValue, step1 } = props;

  const result = useGetAnswer("dietaryHabits", "03", ["A1"]);

  const onPrevHandler = () => {
    setProgressValue(step1 === "예" ? 2 : 1);
  };

  //  답 선택
  const onClick = (value: string) => {
    onChange(
      step3.includes(value)
        ? step3.filter((item: string) => item !== value)
        : step3.concat(value)
    );
  };

  const accountName = useAccountName();
  return (
    <>
      <MainCard type="mission" coachingType="B">
        <MissionTitle>"나의 방해요인 찾아보기"</MissionTitle>
        <TextArea className="text-justify mt-10">
          건강한 식습관을 방해하는 요인을 다시 떠올려보세요.
        </TextArea>
        <TextArea className="mt-5 text-justify">
          {accountName}님이 선택한 어려움 중에서 어떤 것을 개선해 보고 싶나요?
        </TextArea>
        <TextArea className="mt-5 mb-10 text-justify">
          <CheckAnswers
            list={checkAnswerList.filter((r: string) =>
              result.map((it) => it.answerChoice).includes(r)
            )}
            data={step3}
            onChange={onClick}
          />
        </TextArea>
        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrevHandler} />
    </>
  );
}
