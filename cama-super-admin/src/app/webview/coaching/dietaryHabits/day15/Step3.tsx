import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextBox from "../../component/Layout/TextBox";
export default function Day15Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"야식하지 않기"</MissionTitle>
        <TextBox className="text-justify my-10">
          저녁 식사를 충분히 한 후에 밤에는 가급적 위에 부담이 되는 음식을 먹지
          않기로 해요.
        </TextBox>
        <TextArea className="text-justify mt-5 mb-10">
          오늘부터 야식을 끊어볼게요!
        </TextArea>

        <MissionChallengeButton onClick={onSave} />
      </MainCard>

      <NextButton onPrev={onPrev} />
    </>
  );
}
