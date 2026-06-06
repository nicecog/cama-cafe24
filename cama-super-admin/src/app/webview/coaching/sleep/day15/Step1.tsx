import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import SleepCheck from "@/app/webview/coaching/component/SleepCheck";
import MissionTitle from "../../component/Layout/MissionTitle";
// Day15
export default function Day15Step1(props: any) {
  const { data, onChange, onNext } = props;

  return (
    <>
      <MainCard type="question" coachingType="A">
        <MissionTitle>이제 하루만 더 힘을 내요!</MissionTitle>
        <TextArea className="font-bold mt-5">
          오늘은 좋은 수면 습관 만들기 중 저녁시간에 하는 운동에 대해
          알아볼게요.
        </TextArea>
        <SleepCheck data={data} onChange={onChange} />
      </MainCard>
      <NextButton onNext={onNext} />
    </>
  );
}
