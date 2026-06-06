import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import ExcerciseCompleteButton from "@/app/webview/coaching/component/Layout/ExcerciseCompleteButton";
import Inputs from "@/app/webview/coaching/component/Inputs";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import NextButton from "../../component/Layout/NextButton";

export default function Day14Step3(props: any) {
  const { onSave, data, onChange, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>
          " 운동을 못하게 되는 날에 <br />할 수 있는 다른 활동 정하기"
        </MissionTitle>
        <TextArea className=" my-10 ">
          <div className="text-camaColor font-bold tracking-tighter text-center">
            나는 운동을 못 하게 되는 날에는
          </div>
          <Inputs
            value={data.value2}
            onChange={(e: any) => {
              onChange(e.target.value);
            }}
          />

          <div className="text-camaColor font-bold tracking-tighter text-center">
            을 할 것이다.
          </div>
        </TextArea>
        <ExcerciseCompleteButton condition={data} onSave={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
