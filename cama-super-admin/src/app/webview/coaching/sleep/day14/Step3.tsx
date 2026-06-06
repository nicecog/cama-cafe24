import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

export default function Day14Step3(props: any) {
  // props
  const { onSave, onPrev } = props;

  // Render
  return (
    <>
      <MainCard type="mission" coachingType="A">
        <MissionTitle>"낮잠 줄이기"</MissionTitle>
        <TextArea className="text-justify my-10 font-bold">
          낮잠은 가능한 피하고 꼭 필요한 때에만 1시간 이내로 자도록 해요.
        </TextArea>
        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
