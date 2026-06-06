import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";

import useAccountName from "@/hooks/useAccountName";
import useGetAnswer from "@/hooks/useGetAnswer";

import ConfrimAnswerButton from "@/app/webview/coaching/component/Layout/Buttons/ConfirmAnswerButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import useAlert from "@/hooks/useAlert";

// Day1
export default function Day4Step1(props: any) {
  // Props
  const { data, onChange, onNext, setProgressValue } = props;

  const { alert } = useAlert();

  // 다음 선택
  const onNextHandler = () => {
    if (!data) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    data === "예" ? onNext() : setProgressValue(3);
  };

  const accountName = useAccountName();

  const result = useGetAnswer("dietaryHabits", "03", ["A1"]);

  return (
    <>
      <MainCard type="question" coachingType="B">
        <TextBox className="text-justify">
          식사와 관련해서 경험하고 있는 어려움에 대해서 오늘부터 조금씩 해결책을
          찾아보기로 해요.
        </TextBox>
        <TextArea className="mt-5 text-camaColor">
          어제 {accountName}님이 선택한 어려움은
        </TextArea>
        <TextArea className="mt-5 text-justify">
          {result.map((r: any, idx: number) => (
            <p className="text-camaColor1 font-bold" key={idx}>
              {`${idx + 1}. `} {r.answerChoice}
            </p>
          ))}
          <p className="mt-2">입니다.</p>
        </TextArea>
        <TextArea className="my-5  text-justify tracking-tighter">
          이 문제들에 대해 도움을 받고 싶으신가요?
        </TextArea>

        <ConfrimAnswerButton onChange={onChange} value={data} />
      </MainCard>

      <NextButton onNext={onNextHandler} />
    </>
  );
}
