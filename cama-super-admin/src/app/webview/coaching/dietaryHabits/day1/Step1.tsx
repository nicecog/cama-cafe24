import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import ConfrimAnswerButton from "@/app/webview/coaching/component/Layout/Buttons/ConfirmAnswerButton";
import Message from "@/app/webview/coaching/component/Message";
import { useState } from "react";
import MissionTitle from "../../component/Layout/MissionTitle";
import useAlert from "@/hooks/useAlert";

// Day1
export default function Day1Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const [visible, setVisible] = useState<boolean>(false);

  const { alert } = useAlert();

  // 다음 선택
  const onNextHandler = () => {
    if (!data) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    setVisible(true);
  };

  const message = {
    title: data === "예" ? "좋습니다." : <>아직 준비가 안되셨군요. </>,
    height: data === "예" ? `h-[15dvh]` : `h-[25dvh]`,
    message:
      data === "예" ? (
        <>
          카마코치와 함께 건강한 <br />
          식사습관을 만들어 보아요!
        </>
      ) : (
        <>건강한 식습관이 왜 중요한지, 카마코치와 함께 생각해볼게요.</>
      ),
  };

  return (
    <>
      <MainCard type="question" coachingType="B">
        <MissionTitle>
          오늘부터 매일 한 가지씩 건강한 <br />
          식사 습관을 길러 보도록 해요.
        </MissionTitle>

        <TextBox className="mt-5">
          매일 건강한 식습관에 관한 정보와 함께 쉽게 참여할 수 있는 미션을 드릴
          거예요.
        </TextBox>
        <TextArea className="mt-5">
          건강한 식생활로의 여정을 오늘부터 함께해요. 만약 앞으로 15일 이내에
          예정된 수술이 있다면, 회복을 우선시하며 수술 후에 시작하는 것을
          권장합니다.
        </TextArea>

        <TextArea className="mt-5 mb-4 font-bold   text-center">
          준비가 되셨다면, <br />
          변화를 위해 시작해 볼까요?
        </TextArea>

        <ConfrimAnswerButton onChange={onChange} value={data} />
        {/* TODO MEssage 팝업  */}
      </MainCard>
      <Message
        visible={visible}
        onClose={() => setVisible(false)}
        title={message.title}
        height={message.height}
        onOk={onNext}
      >
        {message.message}
      </Message>

      <NextButton onNext={onNextHandler} />
    </>
  );
}
