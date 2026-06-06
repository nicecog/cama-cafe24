import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextArea from "../../component/Layout/TextArea";
import SleepCheck from "../../component/SleepCheck";

// Day5
export default function Day5Step1(props: any) {
  const { data, onChange, onNext } = props;

  return (
    <>
      <MainCard type="question" coachingType="A">
        <TextArea className="font-bold mt-5">
          오늘은 좋은 수면 습관 만들기 중 카페인에 대해 알아볼게요.
        </TextArea>
        <SleepCheck data={data} onChange={onChange} />
      </MainCard>
      <NextButton onNext={onNext} />
    </>
  );
}
