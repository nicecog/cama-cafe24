import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
export default function Day8Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"과일이나 채소 먹기"</MissionTitle>
        <TextArea className="mt-10 text-justify">
          오늘은 꼭 과일이나 채소를 섭취해 보세요.
        </TextArea>
        <TextArea className="mt-5  mb-10 text-justify">
          하지만 특정 암종으로 주의가 필요하신 분들은 오늘의 미션을 건너뛰어도
          괜찮아요.
        </TextArea>

        <MissionChallengeButton onClick={onSave} />
      </MainCard>

      <NextButton onPrev={onPrev} />
    </>
  );
}
