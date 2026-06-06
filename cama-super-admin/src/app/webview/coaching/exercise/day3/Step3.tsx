import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import ExcerciseCompleteButton from "../../component/Layout/ExcerciseCompleteButton";
import TextArea from "../../component/Layout/TextArea";
import NextButton from "../../component/Layout/NextButton";
import TextBox from "../../component/Layout/TextBox";
export default function Day1Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"운동 시작하기"</MissionTitle>
        <TextBox className=" mt-10 text-justify">
          오늘은 아주 간단한 운동이라도 시작을 해 보세요.
        </TextBox>
        <TextArea className="text-justify my-10 ">
          10분 정도의 짧은 운동이라도 시작을 하는 것이 중요해요.
        </TextArea>
        <ExcerciseCompleteButton condition={true} onSave={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
