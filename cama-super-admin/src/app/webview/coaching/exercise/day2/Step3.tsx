import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ExcerciseCompleteButton from "@/app/webview/coaching/component/Layout/ExcerciseCompleteButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
export default function Day2Step3(props: any) {
  //props
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>
          "주변 사람들에게 <br />
          '운동 결심' 을 알리기"
        </MissionTitle>
        <TextBox className="text-justify  mt-10">
          운동을 시작하기로 결심했다면, 그 결심을 주변 사람들과 공유하는 것이 큰
          도움이 됩니다.
        </TextBox>
        <TextArea className="text-justify my-10">
          가족, 친구, 혹은 동료들에게 "나는 오늘부터 운동을 시작하기로 했어"
          라고 말해 보세요.
        </TextArea>
        <ExcerciseCompleteButton onSave={onSave} />
      </MainCard>

      <NextButton onPrev={onPrev} />
    </>
  );
}
