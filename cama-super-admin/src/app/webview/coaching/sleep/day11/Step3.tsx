import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
export default function Day11Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission" coachingType="A">
        <MissionTitle>"운동 시작하기"</MissionTitle>
        <TextArea className="text-justify my-10 font-bold">
          ‘카마 플러스'에 있는 '신체 활동' 코칭을 시작해보세요!
        </TextArea>
        <TextArea className="text-justify my-10 font-bold">
          새로운 프로그램을 시작하는 것이 부담스럽다면, 이른 저녁 시간에 가볍게
          산책을 하는 것도 좋습니다.
        </TextArea>
        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
