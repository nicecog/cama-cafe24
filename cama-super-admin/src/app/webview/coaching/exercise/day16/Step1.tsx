import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import AnswerList from "@/app/webview/coaching/component/Layout/AnswerList";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MissionTitle from "../../component/Layout/MissionTitle";
import TextArea from "../../component/Layout/TextArea";
import useAlert from "@/hooks/useAlert";

const answerList = [
  "많이 개선되었다",
  "어느 정도 개선되었다",
  "별로 개선되지 않았다",
  "전혀 개선되지 않았다",
];

// Day16
export default function Day16Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

  // 다음 선택
  const onNextHandler = () => {
    if (!data) {
      alert("보기를 선택해 주세요. ");
      return;
    }
    onNext();
  };

  //  답 선택
  const onClick = (value: string) => {
    if (data === value) {
      return;
    }
    onChange(value);
  };

  return (
    <>
      <MainCard type="question" coachingType="C">
        <MissionTitle>
          지금까지 매일 성실하게 미션에 <br />
          참여하느라 고생 많았어요.
        </MissionTitle>
        <TextArea className="text-center my-5">
          어제 계획했던대로 운동을 잘 하셨나요?
        </TextArea>
        <AnswerList list={answerList} value={data} onChange={onClick} />
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
