import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

export default function Day13Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission" coachingType="A">
        <MissionTitle>"침실에서 시계를 없애기"</MissionTitle>
        <TextArea className="text-justify my-10 font-bold">
          침실에 있는 벽시계나 탁상시계를 모두 다른 곳으로 옮겨보세요.
          휴대전화는 알람을 맞추고 손이 닿지 않는 곳에 두도록 해요.
        </TextArea>

        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
