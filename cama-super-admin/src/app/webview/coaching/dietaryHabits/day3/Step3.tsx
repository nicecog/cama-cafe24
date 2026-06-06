import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import { checkAnswerList } from "../index";
import CheckAnswers from "../../component/Layout/CheckAnswers";
import TextArea from "../../component/Layout/TextArea";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import useAccountName from "@/hooks/useAccountName";
import useAlert from "@/hooks/useAlert";
export default function Day1Step3(props: any) {
  const { onSave, step3, step1, onChange, onPrev } = props;

  const { alert } = useAlert();

  //  답 선택
  const onClick = (value: string) => {
    onChange(
      step3.includes(value)
        ? step3.filter((item: string) => item !== value)
        : step3.concat(value)
    );
  };

  const onSaveHandler = () => {
    if (step3.length === 0) {
      alert("방해요인을 선택해 주세요 ");
      return;
    }
    onSave();
  };

  const accountName = useAccountName();

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"나의 방해요인 찾아보기"</MissionTitle>
        <TextArea className="mt-10 text-justify">
          건강한 식습관을 방해하는 요인을 다시 떠올려보세요.
        </TextArea>
        <TextArea className="mt-5 text-justify">
          {accountName}님이 선택한 어려움 중에서 어떤 것을 개선해 보고 싶나요?
        </TextArea>
        <TextArea className="mt-5 mb-5">
          <CheckAnswers
            list={checkAnswerList.filter((r: string) => step1.includes(r))}
            data={step3}
            onChange={onClick}
          />
        </TextArea>
        <MissionChallengeButton onClick={onSaveHandler} />
      </MainCard>

      <NextButton onPrev={onPrev} />
    </>
  );
}
