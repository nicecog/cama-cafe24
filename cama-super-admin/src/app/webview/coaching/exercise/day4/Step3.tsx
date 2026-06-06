import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import ExcerciseCompleteButton from "../../component/Layout/ExcerciseCompleteButton";
import TextArea from "../../component/Layout/TextArea";
import NextButton from "../../component/Layout/NextButton";
import TextBox from "../../component/Layout/TextBox";
export default function Day4Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"계획한 운동 실행하기"</MissionTitle>
        <TextBox className="mt-5 text-justify">
          처음부터 무리한 계획은 NO! <br />
          실천 가능한, 쉬운 운동부터 시작하는 것이 좋아요.
        </TextBox>

        <TextArea className="text-justify my-5 font-bold">
          앞으로 점차 시간과 강도를 조금씩 높이기로 해요!
        </TextArea>
        <ExcerciseCompleteButton onSave={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
