import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "../../component/Layout/TextArea";
import MissionChallengeButton from "../../component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

export default function Day7Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission" coachingType="A">
        <MissionTitle>"매일 같은 시간에 자고 일어나기"</MissionTitle>
        <TextArea className="text-justify my-10 font-bold">
          가능하면 전날과 취침 시간, 기상 시간을 1시간 이상 차이 나지 않게
          해보세요.
        </TextArea>
        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
