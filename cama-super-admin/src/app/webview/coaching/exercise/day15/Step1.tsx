import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Inputs from "@/app/webview/coaching/component/Inputs";
import useAlert from "@/hooks/useAlert";

// Day15
export default function Day15Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

  // 다음 선택
  const onNextHandler = () => {
    if (!data) {
      alert("답변을 입력해 주세요");
      return;
    }
    onNext();
  };

  return (
    <>
      <MainCard type="question" coachingType="C">
        <MissionTitle>거의 끝이 보여요.</MissionTitle>
        <TextBox className="mt-5 text-justify">
          저희와 함께 꾸준히 운동을 비롯한 신체 활동을 하고 있나요?
          <br />
          매일 조금씩 운동을 할 수 있다면 더 좋지만 주 3회 이상을 꾸준히
          유지하는 것이 더 중요해요.
        </TextBox>

        <TextArea className="mt-5 text-justify">
          <p>몸을 움직이기 싫은 날에는 무엇을 해 볼 수 있을까요?</p>
          <Inputs
            value={data}
            placeholder="무엇을 해볼까요?"
            onChange={(e: any) => {
              onChange(e.target.value);
            }}
          />
        </TextArea>
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
