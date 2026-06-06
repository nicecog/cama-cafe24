import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import ExcerciseCompleteButton from "@/app/webview/coaching/component/Layout/ExcerciseCompleteButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
export default function Day12Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"활동량 늘리기"</MissionTitle>
        <TextBox className="mt-5 text-center ">
          오늘은 목표 했던 시간보다 5분만 <br />더 움직여보기로 해요!
        </TextBox>
        <TextArea className="text-center my-5 ">
          20분 목표였으면 25분,
          <br />
          30분 목표였으면 35분, <br />
          목표보다 조금만 더 해보는 것은 <br />
          어떨까요?
        </TextArea>
        <ExcerciseCompleteButton condition={true} onSave={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
