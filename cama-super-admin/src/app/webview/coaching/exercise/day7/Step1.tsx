import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import useAccountName from "@/hooks/useAccountName";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import ConfrimAnswerButton from "@/app/webview/coaching/component/Layout/Buttons/ConfirmAnswerButton";
import useAlert from "@/hooks/useAlert";

// Day7
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
      <MainCard type="question" coachingType="C">
        <MissionTitle>
          벌써 절반 가까이 오셨네요,
          <br />
          정말 잘하고 계세요!
        </MissionTitle>
        <MissionTitle className="mt-2">
          지금까지의 경험은 어땠나요?
          <br />
          앞으로도 꾸준히 함께해요.
        </MissionTitle>
        <TextBox className="mt-5  text-justify">
          {accountName}님의 꾸준한 노력은 이미 큰 변화를 만들고 있어요! <br />
        </TextBox>

        <TextArea className=" text-justify mt-5 tracking-tighter">
          어제 미션을 잘 수행했는지 점검해 볼께요.
        </TextArea>
        <TextArea className=" text-justify mb-5 mt-2">
          어제 계획했던 대로 운동을 잘 하셨나요?
        </TextArea>
        <ConfrimAnswerButton onChange={onChange} value={data} />
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
