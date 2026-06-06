import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ConfrimAnswerButton from "@/app/webview/coaching/component/Layout/Buttons/ConfirmAnswerButton";
import useAccountName from "@/hooks/useAccountName";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import useAlert from "@/hooks/useAlert";

// Day1
export default function Day7Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

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
      <MainCard type="question" coachingType="B">
        <TextBox className="text-justify">
          오늘은 당분을 적절하게 조절하는 것의 중요성에 대해서 알아보기로 해요.
          <br />
        </TextBox>
        <TextArea className="my-10 text-justify">
          최근 1주일을 돌아봤을 때 {accountName}님은 당분을 과도하게
          섭취하셨나요?
        </TextArea>

        <ConfrimAnswerButton onChange={onChange} value={data} />
      </MainCard>

      <NextButton onNext={onNextHandler} />
    </>
  );
}
