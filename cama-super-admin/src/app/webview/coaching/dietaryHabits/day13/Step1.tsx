import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ConfrimAnswerButton from "@/app/webview/coaching/component/Layout/Buttons/ConfirmAnswerButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import useAccountName from "@/hooks/useAccountName";
import useAlert from "@/hooks/useAlert";

// Day1
export default function Day13Step1(props: any) {
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
          오늘은 금주의 중요성에 대해서 알아 보려고 해요.
        </TextBox>

        <TextArea className="my-10  text-justify">
          최근 2주일 동안, {accountName} 님은 술을 마신 적이 있나요?
        </TextArea>

        <ConfrimAnswerButton onChange={onChange} value={data} />
      </MainCard>

      <NextButton onNext={onNextHandler} />
    </>
  );
}
