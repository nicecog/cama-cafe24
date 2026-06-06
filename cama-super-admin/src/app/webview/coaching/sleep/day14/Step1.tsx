import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import SleepCheck from "@/app/webview/coaching/component/SleepCheck";
import MissionTitle from "../../component/Layout/MissionTitle";

export default function Day14Step1(props: any) {
  const { data, onChange, onNext } = props;

  return (
    <>
      <MainCard type="question" coachingType="A">
        <MissionTitle>
          이제 3일만 더 하면 <br />
          도전이 끝납니다.
        </MissionTitle>
        <TextArea className="font-bold mt-5">
          오늘은 좋은 수면 습관 만들기 중 낮잠에 대해 알아볼게요.
        </TextArea>
        <SleepCheck data={data} onChange={onChange} />
      </MainCard>
      <NextButton onNext={onNext} />
    </>
  );
}
