import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ExcerciseCompleteButton from "../../component/Layout/ExcerciseCompleteButton";
import NextButton from "../../component/Layout/NextButton";
import TextArea from "../../component/Layout/TextArea";

export default function Day10Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"유산소 운동과 근력 운동 병행하기"</MissionTitle>
        <TextBox className="mt-10  text-justify">
          혹시 일주일 내내 유산소 운동과 근력 운동 중 한 가지만 하고 있지는
          않나요?
        </TextBox>
        <TextArea className="text-justify my-10">
          <p className="mt-2">
            혹시 오늘 선택한 운동이
            <span className="font-bold underline mx-1 text-camaColor1">
              [유산소 운동만]
            </span>
            또는
            <span className="font-bold underline mx-1  text-camaColor1">
              [근력 운동만]
            </span>
            이었다면, 오늘은
            <span className="font-bold underline mx-1  text-camaColor1">
              [유산소 운동과 근력 운동을 함께]
            </span>
            하는 것으로 바꾸어 볼께요!
          </p>
        </TextArea>
        <ExcerciseCompleteButton condition={true} onSave={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
