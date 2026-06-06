import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import ExcerciseCompleteButton from "../../component/Layout/ExcerciseCompleteButton";
import TextArea from "../../component/Layout/TextArea";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextBox from "../../component/Layout/TextBox";
export default function Day8Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"운동 지속하기"</MissionTitle>
        <TextBox className="mt-10  text-justify">
          오늘은 목표했던 시간보다 5분만 더 움직여보기로 해요!
        </TextBox>
        <TextArea className="text-center my-10">
          10분 목표였으면 15분, <br />
          20분 목표였으면 25분,
          <br />
          목표보다 조금만 더 해보는 것은 <br />
          어떨까요?
        </TextArea>
        <ExcerciseCompleteButton condition={true} onSave={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
