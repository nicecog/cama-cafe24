import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ConfrimAnswerButton from "@/app/webview/coaching/component/Layout/Buttons/ConfirmAnswerButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import useAccountName from "@/hooks/useAccountName";
import MissionTitle from "../../component/Layout/MissionTitle";
import useAlert from "@/hooks/useAlert";

// Day14
export default function Day14Step1(props: any) {
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
        <MissionTitle>
          이제 목표까지 3일 남았으니 <br />
          조금만 더 힘을 내 봐요!
        </MissionTitle>
        <TextBox className=" text-justify mt-5">
          오늘은 과식을 피하는 것의 중요성에 대해서 알아보려고 해요.
        </TextBox>

        <TextArea className="my-10    text-justify">
          최근 1주일 동안, {accountName}님이 너무 많은 식사를 했다고 생각되는
          적이 있나요?
        </TextArea>

        <ConfrimAnswerButton onChange={onChange} value={data} />
      </MainCard>

      <NextButton onNext={onNextHandler} />
    </>
  );
}
