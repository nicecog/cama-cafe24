import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ConfrimAnswerButton from "@/app/webview/coaching/component/Layout/Buttons/ConfirmAnswerButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";

import useAccountName from "@/hooks/useAccountName";
import useAlert from "@/hooks/useAlert";

// Day1
export default function Day10Step1(props: any) {
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
        <TextBox>
          오늘은 식재료를 안전하고 건강하게 <br />
          다루는 방법들을 알아보도록 할게요.
        </TextBox>
        <TextArea className="my-10    text-justify">
          {accountName}님은 식재료를 안전하게 관리하는 <br />
          방법에 대해 잘 알고 있나요?
        </TextArea>
        <ConfrimAnswerButton onChange={onChange} value={data} />
      </MainCard>

      <NextButton onNext={onNextHandler} />
    </>
  );
}
