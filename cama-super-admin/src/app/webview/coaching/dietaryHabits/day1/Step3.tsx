import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
export default function Day1Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission" coachingType="B">
        <MissionTitle>
          "냉장고에 있는 음식 중 <br />
          나에게 좋지 않은 것 한 가지 <br />
          찾아보기"
        </MissionTitle>
        <TextArea className=" text-justify my-10 font-bold">
          지금 냉장고를 열어보세요! 그리고 건강에 좋지 않은 음식이나 재료가
          있는지 확인해보세요.
        </TextArea>
        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
