import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import day7Pic from "./day7Pic.png";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";
import ImageBox from "../../component/ImageBox";

export default function Day7Step2(props: any) {
  // Props;
  const { onNext, onPrev, step1 } = props;

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        <TextBox className="mt-10 text-justify">
          <ImageBox imgSrc={day7Pic} />
          <div className="mb-5 text-[#774F2D] font-bold">
            {step1 === "예" ? (
              <>그동안 과도하게 당분을 섭취하셨군요.</>
            ) : (
              <>적절하게 당분을 섭취하고 있었네요!</>
            )}
          </div>
          당분 섭취를 제한해야 하는 몇 가지 중요한 이유를 알려드릴게요.
        </TextBox>

        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 인슐린 수준</TextAreaTitle>
          고당분 식품은 혈당을 급격히 상승시켜 체내의 인슐린 수준을 높여줘요.
          인슐린과 인슐린 성장 인자-1(IGF-1)은 암세포의 성장과 분열을 촉진할 수
          있다는 연구 결과가 있어요.
        </TextArea>

        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 염증 증가</TextAreaTitle>고당분 식품은 염증 반응을
          촉진할 수 있어요. 염증은 암 발생 및 진행과 관련 있으며, 항암 치료의
          효과를 감소시킬 수 있어요.
        </TextArea>

        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 체중 증가와 비만</TextAreaTitle>
          고당분 식품의 섭취는 체중을 증가시켜요. 비만은 항암 치료의 효과를 낮출
          수 있어요.
        </TextArea>

        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 면역 기능 저하</TextAreaTitle>
          고당분 식품은 면역 시스템의 기능을 저하해 암 환자를 감염 및 합병증에
          더욱 취약하게 만들 수 있어요.
        </TextArea>

        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 그 외의 이유</TextAreaTitle>
          고당분 식품은 심장 질환, 당뇨병, 고혈압과 같은 다른 건강 문제의 위험을
          증가시켜요. 이러한 상태는 암 치료의 복잡성을 높일 수 있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          또한, 고당분 식품은 일반적으로 필수 영양소가 부족하여, 암 환자가
          필요로 하는 다양한 미네랄과 비타민의 섭취가 부족해질 수 있어요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
