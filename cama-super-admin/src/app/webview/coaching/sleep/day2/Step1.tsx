import AnswerList from "@/app/webview/coaching/component/Layout/AnswerList";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

import MainCard from "../../component/Layout/MainCard";
import TextBox from "../../component/Layout/TextBox";
import TextArea from "../../component/Layout/TextArea";
import useAlert from "@/hooks/useAlert";
// Day1
export default function Day2Step1(props: {
  data: string;
  onChange: (e: any) => void;
  onNext: (cd: string) => void;
}) {
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();
  //  답 선택
  const onClick = (value: string) => {
    if (data === value) {
      return;
    }
    onChange(value);
  };

  // 다음 선택
  const onNextHandler = () => {
    if (!data) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    onNext("A2");
  };

  const answerList = [
    "5시간 미만",
    "5~6시간",
    "6~7시간",
    "7~8시간",
    "9시간 이상",
  ];

  return (
    <>
      <MainCard type="question" coachingType="A">
        <TextBox>오늘은 현재의 수면 시간을 확인해 보도록 할게요</TextBox>
        <TextArea className="my-5 !text-camaColor font-bold mb-5 text-center">
          최근 1주일간 하루 평균 몇 시간 <br />
          정도를 주무셨나요?
        </TextArea>
        <AnswerList list={answerList} value={data} onChange={onClick} />
      </MainCard>

      <NextButton onNext={onNextHandler} />
    </>
  );
}
