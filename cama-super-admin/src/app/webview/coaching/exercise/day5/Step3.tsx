import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import ExcerciseCompleteButton from "@/app/webview/coaching/component/Layout/ExcerciseCompleteButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Inputs from "@/app/webview/coaching/component/Inputs";

export default function Day5Step3(props: any) {
  const { onSave, data, onChange, onPrev } = props;

  const onChangeHandler = (e: any) => {
    onChange(e.target.value);
  };

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>
          " 운동 습관 만들 때 방해가 되는 <br />
          요인을 하나 이상 찾아보기"
        </MissionTitle>
        <TextArea className=" my-10   text-center font-bold">
          내가 운동을 할 때 방해가 되었던 요인은
          <Inputs value={data} onChange={onChangeHandler} />
          <p className="mt-2 text-md  text-center text-gray-500">
            (없었다면 '없었다'고 입력)
          </p>
        </TextArea>
        <ExcerciseCompleteButton condition={data} onSave={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
