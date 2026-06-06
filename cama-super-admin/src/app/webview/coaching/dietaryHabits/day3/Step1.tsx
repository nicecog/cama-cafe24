import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import useAccountName from "@/hooks/useAccountName";
import CheckAnswers from "../../component/Layout/CheckAnswers";
import { checkAnswerList } from "../index";
import TextArea from "../../component/Layout/TextArea";
import useAlert from "@/hooks/useAlert";
// Day1
export default function Day2Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

  //  답 선택
  const onClick = (value: string) => {
    onChange(
      data.includes(value)
        ? data.filter((item: string) => item !== value)
        : data.concat(value)
    );
  };

  // 다음 선택
  const onNextHandler = () => {
    if (data.length === 0) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    onNext("A2");
  };

  const accountName = useAccountName();

  return (
    <>
      <MainCard type="question" coachingType="B">
        <TextBox className="mt-5">
          식사와 관련해서 {accountName}님이 경험하는 어려움은 무엇인가요? <br />
        </TextBox>
        <TextArea className="mt-10   text-center">
          모두 골라 주세요.(중복 가능)
        </TextArea>

        <TextArea className="mt-5">
          <CheckAnswers list={checkAnswerList} data={data} onChange={onClick} />
        </TextArea>
      </MainCard>

      <NextButton onNext={onNextHandler} />
    </>
  );
}
