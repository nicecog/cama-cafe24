import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionTitle from "../../component/Layout/MissionTitle";
import Answer from "../../component/Layout/AnswerRadio";
import useAlert from "@/hooks/useAlert";

// Day1
export default function Day16Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

  //  답 선택
  const onChangeHandler = (index: number) => (_: any) => {
    onChange(index);
  };

  // 다음 선택
  const onNextHandler = () => {
    if (data === null) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    onNext();
  };

  return (
    <>
      <MainCard type="question" coachingType="B">
        <MissionTitle>드디어 마지막 날입니다!</MissionTitle>
        <TextBox className="text-justify  mt-5">
          지난 15일간 건강한 식사 습관 만들기 위해 노력한 결과가 어떤가요?
        </TextBox>

        <TextArea className="my-10  text-justify">
          스스로의 실천에 대해서 평가해 보세요.
        </TextArea>

        <Answer
          onChange={onChangeHandler(0)}
          checked={data === 0}
          className="mt-1"
        >
          습관 개선을 위해 최선을 다 했고, <br />
          실제로 식사습관이 좋아졌다.
        </Answer>
        <Answer
          onChange={onChangeHandler(1)}
          checked={data === 1}
          className="mt-1"
        >
          습관 개선을 위해 노력했지만,
          <br /> 생각만큼 습관이 바뀌지 않았다.
        </Answer>
        <Answer
          onChange={onChangeHandler(2)}
          checked={data === 2}
          className="mt-1"
        >
          충분히 노력하지 못 한 것 같다.
        </Answer>
        <Answer
          onChange={onChangeHandler(3)}
          checked={data === 3}
          className="mt-1"
        >
          잘 모르겠다.
        </Answer>
      </MainCard>

      <NextButton onNext={onNextHandler} />
    </>
  );
}
