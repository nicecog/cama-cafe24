import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import useAccountName from "@/hooks/useAccountName";
import useGetAnswer from "@/hooks/useGetAnswer";

import ExerciseType from "../../component/Layout/ExerciseType";
import TextArea from "../../component/Layout/TextArea";
import useAlert from "@/hooks/useAlert";
import ImporText from "../../mental/component/ImportText";
// Day1
export default function Day4Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

  // 다음 선택
  const onNextHandler = () => {
    if (!data.type) {
      alert("운동을 선택해 주십시오.");
      return;
    }
    onNext();
  };

  const accountName = useAccountName();

  const list = useGetAnswer("exercise", "03", ["A1"]);

  return (
    <>
      <MainCard type="question" coachingType="C">
        <TextBox>오늘 어떤 운동을 얼마나 할 것인지 선택해 보세요.</TextBox>

        <TextArea className="my-5 text-justify ">
          {accountName}님이 도전하기로 한 운동 습관은
        </TextArea>
        <TextArea className="my-2 mb-5 p-3 border rounded-lg shadow-md bg-white">
          {list.map((i, idx) => (
            <div
              key={idx}
              className="text-camaColor flex items-start gap-2 py-0.5"
            >
              <div>{idx + 1}.</div>
              <div>{i.answerChoice}</div>
            </div>
          ))}
          <p className="my-1">
            <ImporText>{list.length}가지</ImporText> 입니다.
          </p>
        </TextArea>

        <ExerciseType data={data} onChange={onChange} />
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
