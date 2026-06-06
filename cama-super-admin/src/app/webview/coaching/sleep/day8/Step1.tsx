import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";

import useAccountName from "@/hooks/useAccountName";

import useGetAnswer from "@/hooks/useGetAnswer";
import { getNumberInnerText } from "../../lib/coachingUtils";
import TextArea from "../../component/Layout/TextArea";
import ConfrimAnswerButton from "../../component/Layout/Buttons/ConfirmAnswerButton";
import SleepCheck from "../../component/SleepCheck";
import useAlert from "@/hooks/useAlert";

export default function Day8Step1(props: any) {
  const { data, onNext, onChange } = props;

  const { alert } = useAlert();
  // 다음 선택
  const onNextHandler = () => {
    if (!data.answer) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    onNext();
  };

  const accountName = useAccountName();
  // 3일차 꺼를 기준으로 함
  const answers = useGetAnswer("sleep", "03", ["A1", "A2"]);
  const targetTime = getNumberInnerText(
    answers.find((r) => r.answerChoice.includes("총수면 시간"))?.answerChoice
  );

  const sleepTime = getNumberInnerText(
    answers.find((r) => r.answerChoice.includes("취침시간"))?.answerChoice
  );

  //  답 선택
  const onClick = (value: string) => {
    if (data.answer === value) {
      return;
    }
    onChange((s: any) => ({
      ...s,
      answer: value,
    }));
  };

  return (
    <>
      <MainCard type="question" coachingType="A">
        <TextBox>
          오늘은 지난 일주일간 수면 습관이 계획대로 잘 지켜졌는지 확인해 보기로
          해요.
        </TextBox>
        <TextArea className="mt-5 text-justify">
          <span className="font-bold  text-camaColor">{accountName}</span>
          님은 하루에
          <span className="font-bold mx-1 text-camaColor1  ">
            {targetTime}시간
          </span>
          만큼 수면을 취하는 목표를 세웠고
          <span className="font-bold text-camaColor1  ml-2">{sleepTime}시</span>
          에 잠자리에 드는 계획을 세웠어요.
        </TextArea>

        <TextArea className="mt-5 font-bold text-center mb-5">
          이러한 계획들이 잘 지켜졌나요?
        </TextArea>
        <ConfrimAnswerButton onChange={onClick} value={data.answer} />
        <div className="mt-10">
          <SleepCheck data={data} onChange={onChange} />
        </div>
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
