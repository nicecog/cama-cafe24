import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "../../component/Layout/TextArea";
import MissionChallengeButton from "../../component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

export default function Day9Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission" coachingType="A">
        <MissionTitle>"수면 환경 바꾸기"</MissionTitle>
        <TextArea className="text-justify my-10 font-bold">
          오늘 배운 내용을 떠올리며, 잠을 잘 잘 수 있는 환경으로 방을 바꾸어
          보세요.
        </TextArea>
        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
