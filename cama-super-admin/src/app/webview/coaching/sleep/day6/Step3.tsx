import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

export default function Day6Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission" coachingType="A">
        <MissionTitle>
          "저녁 시간에 TV, 스마트폰 <br />
          사용 줄이기"
        </MissionTitle>
        <TextArea className="text-justify my-10 font-bold">
          9시 이후로는 스마트폰이나 TV를 멀리해 보세요. 아예 안 보는 것이
          불가능하다면 취침시간 1시간 전부터 만이라도 꺼 보세요.
        </TextArea>
        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
