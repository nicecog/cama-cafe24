import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import useAccountName from "@/hooks/useAccountName";
import NextButton from "../../component/Layout/NextButton";
import ConfrimAnswerButton from "../../component/Layout/Buttons/ConfirmAnswerButton";
import TextArea from "../../component/Layout/TextArea";
import TextBox from "../../component/Layout/TextBox";
import useAlert from "@/hooks/useAlert";
import ImporText from "../../mental/component/ImportText";

export default function Day11Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

  const accountName = useAccountName();
  // 다음 선택
  const onNextHandler = () => {
    if (!data) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    onNext();
  };

  return (
    <>
      <MainCard type="question" coachingType="C">
        <TextBox className="text-justify">
          <p>
            오늘은 운동을 할 때 주의해야 할 중요한 사항들에 대해 알아볼 거예요.
          </p>
          <p className="mt-2">
            <ImporText className="mr-0">{accountName}님</ImporText>의 건강한
            생활을 위해 오늘도 최선을 다해 도와드릴게요!
          </p>
        </TextBox>

        <TextArea className="my-10 text-justify ">
          {accountName}님은 운동을 할 때 주의해야 할 사항을 잘 알고 있나요?
        </TextArea>
        <ConfrimAnswerButton value={data} onChange={onChange} />
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
