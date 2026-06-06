import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import useAccountName from "@/hooks/useAccountName";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ConfrimAnswerButton from "../../component/Layout/Buttons/ConfirmAnswerButton";
import TextArea from "../../component/Layout/TextArea";
import useAlert from "@/hooks/useAlert";

// Day1
export default function Day1Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

  //  답 선택
  const onClick = (value: string) => {
    if (data === value) {
      return;
    }
    onChange(value);
  };

  // 다음 선택
  const onNextHandler = () => {
    if (!data) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    onNext();
  };

  const accountName = useAccountName();

  return (
    <>
      <MainCard type="question" coachingType="C">
        <TextBox>
          오늘부터 매일 한 가지씩 건강한 운동 <br />
          습관을 길러 보도록 해요.
          <br />
        </TextBox>
        <TextArea className="mt-10 ">
          앞으로 매일 간단한 질문과 함께 쉽게 참여
          <br />할 수 있는 미션을 드릴 거에요.
        </TextArea>
        <TextArea className="my-10 text-center">
          {accountName} 님 꾸준히 운동을 하고 있나요?
        </TextArea>
        <ConfrimAnswerButton onChange={onClick} value={data} />
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
