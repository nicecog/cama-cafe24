import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
export default function Day3Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission" coachingType="B">
        <MissionTitle>
          "지금까지 먹어보지 않은,
          <br /> 건강에 좋은 음식 한 가지 <br />
          도전해보기"
        </MissionTitle>
        <TextArea className="text-justify my-10  ">
          오늘 배운 내용을 떠올려보세요.
          <br /> 건강에 좋은 음식들 중에 당신이 기피하던 음식이 있나요? 한
          가지를 떠올려보고, 건강한 음식 먹기에 도전해보세요.
        </TextArea>
        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
