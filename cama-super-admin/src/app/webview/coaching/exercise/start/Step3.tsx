import { ChangeEvent } from "react";
import useAccountName from "@/hooks/useAccountName";

import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import Progress from "@/app/webview/coaching/component/Layout/Progress";
import ExcerciseCompleteButton from "../../component/Layout/ExcerciseCompleteButton";
import TextArea from "../../component/Layout/TextArea";
import Inputs from "../../component/Inputs";
import NextButton from "../../component/Layout/NextButton";
export default function StartDayStep3(props: any) {
  //props
  const { data, onSave, onChange, onPrev } = props;

  const accountName = useAccountName();

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>
          "삶의 가치를 되새기고 <br />
          운동 각오 다지기"
        </MissionTitle>
        <TextBox className="text-center mt-10">
          오늘은, 지금 나에게 운동이 얼마나 <br />
          중요한지 생각해봅시다.
        </TextBox>

        <TextArea className="text-center mt-7  ">
          {accountName} 님이 원하는 삶을 위해
          <br />
          운동이 얼마나 중요한가요? <br />
          0~100% 사이에 답해보세요.
          <br />
          (0:전혀 중요하지 않음, 100:매우 중요함)
          <Progress
            onChange={onChangeHandler}
            value={data.value1}
            className="my-4"
          />
          <div className="text-camaColor font-bold tracking-tighter mt-5 mb-2">
            운동의 중요도를 높이기 위해 <br />
            오늘 할 수 있는 것은 무엇인가요?
          </div>
          <Inputs value={data.value2} onChange={onChangeHandler} />
        </TextArea>
        <TextArea className="my-5  text-center">
          오늘 할 수 있는 것부터 차근히 해나가면 16일 후에는 내가 원하는 운동
          습관을 지닌 나의 모습을 만날 수 있을 것입니다.
        </TextArea>
        <ExcerciseCompleteButton condition={data.value2} onSave={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
