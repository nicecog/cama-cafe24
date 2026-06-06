import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextBox from "../../component/Layout/TextBox";
export default function Day16Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>
          "그동안 진행했던 미션들을
          <br /> 매일 실천해보세요!"
        </MissionTitle>
        <TextBox className="text-center my-10 font-bold">
          오늘은 미션이 없습니다!
        </TextBox>

        <MissionChallengeButton onClick={onSave} />
      </MainCard>

      <NextButton onPrev={onPrev} />
    </>
  );
}
