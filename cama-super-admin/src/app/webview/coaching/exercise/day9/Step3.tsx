import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import ExcerciseCompleteButton from "../../component/Layout/ExcerciseCompleteButton";
import NextButton from "../../component/Layout/NextButton";
import Inputs from "../../component/Inputs";
import TextArea from "../../component/Layout/TextArea";

export default function Day9Step3(props: any) {
  const { onSave, data, onChange, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>
          "내가 꾸준히 운동하는 데 <br />
          방해가 되는 요인을 하나 이상 <br />
          찾아보기"
        </MissionTitle>
        <TextArea className=" my-10  text-center">
          내가 운동을 할 때 방해가 되었던 요인은
          <Inputs
            value={data.value2}
            onChange={(e: any) => {
              onChange(e.target.value);
            }}
          />
          <p className="mt-2 text-md text-center text-gray-500">
            (없었다면 없었다고 입력)
          </p>
        </TextArea>
        <ExcerciseCompleteButton condition={data.length > 0} onSave={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
