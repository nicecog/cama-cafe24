import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

export default function Day12Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission" coachingType="A">
        <MissionTitle>"금주 선언하기"</MissionTitle>
        <TextArea className="text-justify my-10 font-bold">
          가족이나 가까운 친구들에게 다음과 같이 선언해 보세요. <br />
          직접 말로 하거나 휴대전화 메시지로 보내셔도 좋습니다.
        </TextArea>
        <MissionTitle className="text-justify tracking-tighter mb-10">
          "나는 자기 전에 술을 마시지 않겠다."
        </MissionTitle>
        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
