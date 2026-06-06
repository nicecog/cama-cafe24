import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import TextArea from "../../component/Layout/TextArea";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
export default function Day5Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"하루 세 끼 모두 챙겨먹기"</MissionTitle>
        <TextArea className="mt-10  text-justify">
          오늘은 규칙적인 식사의 중요성을 다시금 생각해보는 시간이었어요.
        </TextArea>
        <TextArea className="mt-5  mb-10  text-justify">
          하루 세 번의 식사 시간을 미리 정해두고, 식사를 해봅시다.
        </TextArea>

        <MissionChallengeButton onClick={onSave} />
      </MainCard>

      <NextButton onPrev={onPrev} />
    </>
  );
}
