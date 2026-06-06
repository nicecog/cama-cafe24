import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import Day6Pic from "./day6.png";
import ExerciseResult from "@/app/webview/coaching/component/Layout/ExerciseResult";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";

import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import ImageBox from "../../component/ImageBox";

export default function Day6Step2(props: any) {
  // Props;
  const { onNext, data, onPrev } = props;

  return (
    <>
      <MainCard type="infomation">
        <InfomationTitle>
          운동이 부족할 때 <br />
          생기는 문제 2
        </InfomationTitle>
        <TextBox className="mt-10 text-justify">
          <ImageBox imgSrc={Day6Pic} />
          운동이 부족하면 생기는 문제에 대해 좀더 알아볼게요.
        </TextBox>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 치료 효과 저하</TextAreaTitle>연구에 따르면 운동
          부족은 치료 효과를 낮출 수 있다고 해요. 반대로 적절한 운동은 항암
          치료의 효과를 높일 수 있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 피로감 증가</TextAreaTitle>항암 치료 과정에서 흔히
          발생하는 부작용 중 하나는 피로에요. 적절한 운동은 피로를 줄이고
          에너지를 향상시키나, 운동 부족은 피로를 더욱 증가시킬 수 있어요.
        </TextArea>
        <ExerciseResult data={data} />
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
