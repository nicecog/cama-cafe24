import { ChangeEvent } from "react";
import useAccountName from "@/hooks/useAccountName";

import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import Progress from "@/app/webview/coaching/component/Layout/Progress";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import SubTitle from "@/app/webview/coaching/component/Layout/SubTitle";
import Inputs from "@/app/webview/coaching/component/Inputs";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextBox from "../../component/Layout/TextBox";
import useAlert from "@/hooks/useAlert";

export default function StartDayStep3(props: any) {
  //props
  const { step1, onSave, data, onChange, onPrev } = props;

  const accountName = useAccountName();

  const { alert } = useAlert();
  //  선택된 step1 정보
  const selectedText = step1.extra ? step1.extra : step1.value;

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const onSaveHandler = () => {
    if (data.value2.trim() === "") {
      alert("내용을 입력해 주세요");
      return;
    }
    onSave();
  };

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>
          "삶의 가치를 되새기고 <br />
          건강한 수면 습관을 <br />
          형성할 각오 다지기"
        </MissionTitle>
        <TextBox className="my-5 px-2">
          <SubTitle className="text-center">
            {accountName}님에게 중요한 삶의 가치는
            <br />
            <span className="text-camaColor1 mx-1">{selectedText}</span>
            입니다.
          </SubTitle>
        </TextBox>

        <TextArea className="text-center mt-7 !text-camaColor !font-bold">
          {accountName} 님이 원하는 삶을 위해 <br />
          수면 습관이 얼마나 중요한가요? <br />
          0~100% 사이에 답해보세요.
          <br />
          (0:전혀 중요하지 않음, 100:매우 중요함)
          <Progress
            onChange={onChangeHandler}
            value={data.value1}
            className="my-4"
          />
          <div className="text-camaColor font-bold tracking-tighter mt-5 mb-2">
            수면 습관을 변화시키기 위해 <br />
            오늘 할 수 있는 것은 무엇인가요? <br />
            (예: 커피 줄이기)
          </div>
          <Inputs value={data.value2} onChange={onChangeHandler} />
        </TextArea>
        <TextArea className="my-5  text-center">
          오늘 당장 실천할 수 있는 작은 일부터 시작하면, 16일 후에는 건강한 수면
          습관을 가진 자신을 발견하게 될 거예요.
        </TextArea>

        <MissionChallengeButton onClick={onSaveHandler} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
