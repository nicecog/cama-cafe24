import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "../../component/Layout/TextArea";

import Day2Pic from "./day2.png";
import ImageBox from "../../component/ImageBox";

export default function Day2Step2(props: any) {
  // Props;
  const { step1, onNext, onPrev } = props;

  const score = step1.filter((it: any) => it.value).length;

  // (2점 이하) 조금 더 운동이 필요해요! 지금의 생활습관에 변화를 줘 보세요.
  // (3~5점) 이미 어느 정도 운동을 하고 있네요! 지금보다 조금 더 건강한 습관을 만들어보세요.
  // (6점 이상) 대체로 좋은 운동 습관을 가지고 있어요! 지금의 습관을 계속 유지하세요.

  return (
    <>
      <MainCard type="infomation">
        {score <= 2 && (
          <>
            <TextBox className="mt-5 text-center !text-camaColor1 font-bold">
              <ImageBox imgSrc={Day2Pic} containerClassName="!mb-0" />
              운동을 비롯한 신체 활동이 <br />
              조금 더 필요해요!
            </TextBox>
            <TextArea className="mt-10 text-center">
              카마코치가 꾸준히 활동을 늘릴 수 있도록 도와드릴게요.^^
            </TextArea>
          </>
        )}
        {3 <= score && score <= 5 && (
          <>
            <TextBox className="mt-5 text-center !text-camaColor1 font-bold">
              <ImageBox imgSrc={Day2Pic} containerClassName="!mb-0" />
              현재 운동에 관심을 갖고,
              <br /> 운동을 하고 있네요!
            </TextBox>
            <TextArea className="mt-10 text-center">
              카마코칭을 통해 좀 더 <br />
              건강한 습관을 만들어 보세요.
            </TextArea>
          </>
        )}
        {score >= 6 && (
          <>
            <TextBox className="mt-5 text-center !text-camaColor1 font-bold">
              <ImageBox imgSrc={Day2Pic} containerClassName="!mb-0" />
              대체로 좋은 운동 습관을 가지고 있어요!
            </TextBox>
            <TextArea className="mt-10 text-center">
              지금의 습관을 계속 유지하세요. <br />
              카마코치가 도와드릴게요.
            </TextArea>
          </>
        )}
      </MainCard>

      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
