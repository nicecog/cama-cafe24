import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import useAccountName from "@/hooks/useAccountName";
import CheckAnswers from "../../component/Layout/CheckAnswers";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import { checkAnswerList } from "../index";
import useAlert from "@/hooks/useAlert";
// Day1
export default function Day12Step1(props: any) {
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
    onNext();
  };

  const accountName = useAccountName();

  return (
    <>
      <MainCard type="question" coachingType="B">
        <TextBox className="text-justify">
          오늘은 식사 문제를 다시 점검하고 해결책을 찾아보겠습니다.
        </TextBox>
        <TextArea className="my-10 text-justify">
          최근 식사와 관련해서 {accountName}님이 경험하는 어려움은 어떤
          것인가요?
          <p className="font-bold text-[16px]">(중복 가능)</p>
        </TextArea>

        <TextArea className="mt-5">
          <CheckAnswers list={checkAnswerList} data={data} onChange={onClick} />
        </TextArea>
      </MainCard>

      <NextButton onNext={onNextHandler} />
    </>
  );
}
