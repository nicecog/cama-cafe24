import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import { checkAnswerList } from "../index";
import CheckAnswers from "@/app/webview/coaching/component/Layout/CheckAnswers";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import useAccountName from "@/hooks/useAccountName";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import useAlert from "@/hooks/useAlert";
export default function Day12Step3(props: any) {
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
  const accountName = useAccountName();

  const onSaveHandler = () => {
    if (step3.length === 0) {
      alert("선택해 주세요");
      return;
    }
    onSave();
  };
  const onPrevHandler = () => {
    onChange([]);
    onPrev();
  };

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"나의 개선 목표 정하기"</MissionTitle>
        <TextBox className="text-justify mt-10">
          오늘은 {accountName}님이 식사와 관련하여 겪고 있는 어려움을 다시
          확인했어요.
        </TextBox>

        <TextArea className="mt-5  mb-10 text-justify">
          {accountName}님이 겪는 어려움 중에 개선해 보고 싶은 것은 무엇인가요?
        </TextArea>

        <TextArea className="my-10">
          <CheckAnswers
            list={checkAnswerList.filter((r: string) => step1.includes(r))}
            data={step3}
            onChange={onClick}
          />
        </TextArea>
        <MissionChallengeButton onClick={onSaveHandler} />
      </MainCard>

      <NextButton onPrev={onPrevHandler} />
    </>
  );
}
