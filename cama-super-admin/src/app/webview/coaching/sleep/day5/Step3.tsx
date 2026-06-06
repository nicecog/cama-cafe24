import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

export default function Day5Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission" coachingType="A">
        <MissionTitle>
          "점심시간 이후로는 <br />
          커피 마시지 않기"
        </MissionTitle>
        <TextArea className="text-justify my-10 font-bold">
          좋은 수면을 위해 커피, 녹차, 콜라 등 카페인이 함유된 음료의 양과 섭취
          시간을 조절하는 것이 중요합니다. 커피는 되도록 오전 시간에 마시거나,
          여러 잔을 마시는 경우 양을 줄여보세요.
        </TextArea>
        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
