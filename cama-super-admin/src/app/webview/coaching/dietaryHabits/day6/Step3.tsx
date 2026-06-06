import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import TextArea from "../../component/Layout/TextArea";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
export default function Day6Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>
          "하루에 두 끼 이상 <br />
          단백질을 섭취하기"
        </MissionTitle>
        <TextArea className="mt-10 text-justify tracking-tighter">
          오늘은 단백질 섭취의 중요성을 알아봤어요.
        </TextArea>
        <TextArea className="mt-5  mb-10 text-justify">
          오늘의 미션은, 단백질 음식을 하루에 두 끼 이상 섭취하는 거예요.
          이왕이면 동물성 단백질과 식물성 단백질을 고루 먹는 것이 좋습니다.
        </TextArea>

        <MissionChallengeButton onClick={onSave} />
      </MainCard>

      <NextButton onPrev={onPrev} />
    </>
  );
}
