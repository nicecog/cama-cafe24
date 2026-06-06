import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import SleepCheck from "@/app/webview/coaching/component/SleepCheck";
import MissionTitle from "../../component/Layout/MissionTitle";
import ImageBox from "../../component/ImageBox";
import Day13Title from "./Day13Title.png";

// Day13
export default function Day13Step1(props: any) {
  const { data, onChange, onNext } = props;

  return (
    <>
      <MainCard type="question" coachingType="A">
        <MissionTitle className="mb-5">
          이제 목표의 80%를 넘었습니다.
        </MissionTitle>
        <ImageBox imgSrc={Day13Title} className="shadow-md" />
        <TextArea className="font-bold mt-5">
          오늘은 좋은 수면 습관 만들기 중 시계보는 습관에 대해 알아볼게요.
        </TextArea>
        <SleepCheck data={data} onChange={onChange} />
      </MainCard>
      <NextButton onNext={onNext} />
    </>
  );
}
