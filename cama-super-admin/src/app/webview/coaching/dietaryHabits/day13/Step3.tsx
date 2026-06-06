import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
export default function Day13Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"술 마시지 않기"</MissionTitle>
        <TextArea className="text-justify my-10">
          오늘부터 금주를 실천해 보세요.
        </TextArea>

        <MissionChallengeButton onClick={onSave} />
      </MainCard>

      <NextButton onPrev={onPrev} />
    </>
  );
}
