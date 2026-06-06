import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import ConfrimAnswerButton from "@/app/webview/coaching/component/Layout/Buttons/ConfirmAnswerButton";
import Message from "@/app/webview/coaching/component/Message";
import { useState } from "react";
import useAccountName from "@/hooks/useAccountName";
import useAlert from "@/hooks/useAlert";

// Day1
export default function Day2Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

  const [visible, setVisible] = useState<boolean>(false);

  // 다음 선택
  const onNextHandler = () => {
    if (!data) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    setVisible(true);
  };

  const message = {
    title:
      data === "예" ? (
        <>
          적당한 양의 식사를 <br />
          하고 있네요!
        </>
      ) : (
        <>평소 적당한 양의 식사를 하지 못하고 있었네요.</>
      ),
    height: data === "예" ? `h-[20dvh]` : `h-[20dvh]`,
    message:
      data === "예" ? (
        <>더 만족스러운 식사를 위해 저희와 함께 해요.</>
      ) : (
        <>
          건강한 식습관을 위해 <br />
          저희와 함께 해요!
        </>
      ),
  };

  const accountName = useAccountName();

  return (
    <>
      <MainCard type="question" coachingType="B">
        <TextBox className="text-camaColor mb-5 ">
          오늘은 식사를 잘하는 방법에 대해서 알아보기로 해요.
        </TextBox>
        <TextArea className="my-10   ">
          최근 1주일을 돌아봤을 때, {accountName} 님은 건강한 식단으로 적당한
          양의 식사를 하고 있나요?
        </TextArea>

        <ConfrimAnswerButton onChange={onChange} value={data} />
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
