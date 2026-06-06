import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

export default function Day15Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission" coachingType="A">
        <MissionTitle>
          "저녁 시간을 이완된 상태로 <br />
          평화롭게 보내기"
        </MissionTitle>
        <TextArea className="text-justify my-10 font-bold">
          저녁 시간에 격한 운동이나 활동은 피하고, 정적인 활동을 해보세요.
        </TextArea>

        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
