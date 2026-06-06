import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import ExcerciseCompleteButton from "@/app/webview/coaching/component/Layout/ExcerciseCompleteButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Inputs from "@/app/webview/coaching/component/Inputs";

export default function Day15Step3(props: any) {
  const { onSave, data, onChange, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>
          "내가 꾸준히 운동해서 <br />
          얻을 수 있는 것 생각해보기"
        </MissionTitle>
        <TextArea className=" my-10 text-center">
          <p>
            내가 앞으로도 지금처럼 운동을 <br />
            꾸준히 계속한다면
          </p>
          <Inputs
            value={data}
            onChange={(e: any) => {
              onChange(e.target.value);
            }}
          />
          <p> 가(이) 좋아질 것이다.</p>
        </TextArea>
        <ExcerciseCompleteButton condition={data} onSave={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
