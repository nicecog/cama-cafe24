import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import Day14Pic from "./Day14Pic.png";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import ExerciseResult from "../../component/Layout/ExerciseResult";
import ImageBox from "../../component/ImageBox";

export default function Day14Step2(props: any) {
  // Props;
  const { onNext, onPrev, data } = props;

  return (
    <>
      <MainCard type="infomation">
        <InfomationTitle>
          일상에서 꾸준히 <br />
          운동하기
        </InfomationTitle>
        <TextBox className="mt-10 text-justify">
          <ImageBox imgSrc={Day14Pic} />
          가끔은 운동하기 힘든 날도 있고, 어떤 날은 운동이나 신체 활동을 하고
          싶지 않을 때도 있어요.
        </TextBox>

        <TextArea className="mt-10 text-justify">
          그러나 반드시 야외에서만 운동을 비롯한 신체 활동을 할 수 있는 것이
          아니며, 힘들고 어려운 운동만이 도움이 되는 것 또한 아니에요.
        </TextArea>

        <TextArea className="mt-10 text-justify">
          일상적인 활동인 설거지나 청소, 화초 가꾸기와 같은, 어찌 보면 운동처럼
          보이지 않을 수도 있지만 몸을 쓸 수 있는 활동이면 무엇이라도 좋아요.
        </TextArea>
        <ExerciseResult data={data} />
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
