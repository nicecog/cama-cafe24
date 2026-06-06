import { ChangeEvent } from "react";
import useAccountName from "@/hooks/useAccountName";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import Progress from "@/app/webview/coaching/component/Layout/Progress";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Inputs from "@/app/webview/coaching/component/Inputs";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import useAlert from "@/hooks/useAlert";

export default function StartDayStep3(props: any) {
  //props
  const { data, onSave, onChange, onPrev } = props;

  const { alert } = useAlert();

  const accountName = useAccountName();

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
          건강한 식사 습관을 <br />
          갖기 위한 마음 다지기"
        </MissionTitle>

        <TextArea className="text-center mt-7 !text-camaColor !font-bold">
          오늘은 나의 행복한 인생을 위해서 <br />
          올바른 식습관의 중요성에 대해 <br />
          함께 생각해 보아요.
        </TextArea>
        <TextArea className="text-center mt-7 !text-camaColor !font-bold">
          {accountName} 님이 원하는 삶을 위해 <br />
          식습관이 얼마나 중요한가요? <br />
          0~100% 사이에 답해보세요.
          <br />
          (0: 전혀 중요하지 않음, 100: 매우 중요함)
          <Progress
            onChange={onChangeHandler}
            value={data.value1}
            className="my-4"
          />
          <div className="text-camaColor font-bold tracking-tighter mt-5 mb-2">
            식습관을 변화시키기 위해 <br />
            오늘 할 수 있는 것은 무엇인가요? <br />
            (예 : 야채 많이 먹기)
          </div>
          <Inputs value={data.value2} onChange={onChangeHandler} />
        </TextArea>
        <TextArea className="my-5  text-center">
          오늘 당장 실천할 수 있는 작은 일부터 <br />
          시작하면, 16일 후에는 건강한 식습관을 가진 자신을 발견하게 될 거예요.
        </TextArea>

        <MissionChallengeButton onClick={onSaveHandler} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
