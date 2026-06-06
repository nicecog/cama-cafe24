import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import ExcerciseCompleteButton from "@/app/webview/coaching/component/Layout/ExcerciseCompleteButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";

export default function Day6Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"계획한 운동 실행하기"</MissionTitle>
        <TextArea className=" text-justify my-10 font-bold">
          지난 번에 계획대로 잘 진행되었다면 시간을 유지하거나 조금 더
          늘려보세요.
        </TextArea>
        <ExcerciseCompleteButton condition={true} onSave={onSave} />
      </MainCard>

      <NextButton onPrev={onPrev} />
    </>
  );
}
