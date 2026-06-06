import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ExerciseType from "../../component/Layout/ExerciseType";
import useAlert from "@/hooks/useAlert";

// Day12
export default function Day12Step1(props: any) {
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

  return (
    <>
      <MainCard type="question" coachingType="C">
        <TextBox className="mb-10 text-justify">
          오늘 어떤 운동을 얼마나 할 것인지 선택해 보세요.
        </TextBox>
        <ExerciseType data={data} onChange={onChange} />
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
