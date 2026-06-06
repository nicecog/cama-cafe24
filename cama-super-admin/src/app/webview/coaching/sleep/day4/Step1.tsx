import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import SleepCheck from "../../component/SleepCheck";
import TextArea from "../../component/Layout/TextArea";
type StepData = {
  wakeup: string;
  sleep: string;
};

type Day4Step1 = {
  data: StepData;
  onNext: (cd: string) => void;
  onChange: (e: StepData) => void;
};

// Day4
export default function Day4Step1(props: any) {
  // props
  const { data, onChange, onNext } = props;

  return (
    <>
      <MainCard type="question" coachingType="A">
        <TextArea className="font-bold mt-5">
          오늘부터는 수면에 도움이 되는 습관을 만들어 보려고 해요.
        </TextArea>
        <SleepCheck data={data} onChange={onChange} />
      </MainCard>
      <NextButton onNext={onNext} />
    </>
  );
}
