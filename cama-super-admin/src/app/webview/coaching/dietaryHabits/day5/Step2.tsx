import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import day5Pic from "./day5Pic.png";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";
import ImageBox from "../../component/ImageBox";

export default function Day5Step2(props: any) {
  // Props;
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        <InfomationTitle>규칙적인 식사</InfomationTitle>
        <TextBox className="mt-10 text-justify">
          <div className="flex justify-center mb-10">
            <ImageBox imgSrc={day5Pic} />
          </div>
          <div className="mb-5 text-[#774F2D] font-bold">
            건강한 식사의 기본은 규칙적인 식사입니다.
          </div>
          규칙적인 식사를 통해 얻을 수 있는 이점들을 살펴볼게요.
        </TextBox>

        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>✔ 영양상태 유지</TextAreaTitle>
          규칙적인 식사는 필요한 열량과 영양소를 꾸준히 공급하여 암치료의 효과를
          높일 수 있어요. 비규칙적인 식사는 영양 불균형을 초래할 수 있어요.
        </TextArea>

        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>✔ 부작용 관리</TextAreaTitle>
          항암치료로 인한 부작용(예: 구토, 식욕 부진 등)을 더 잘 관리할 수
          있어요. 적은 양을 규칙적으로 먹는 것은 구토나 위염을 줄일 수 있습니다.
        </TextArea>

        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>✔ 혈당 조절</TextAreaTitle>
          규칙적인 식사는 혈당 수치를 안정적으로 유지하게 도와줘요. 혈당의
          급격한 변화는 물리적인 불편함과 함께 면역 시스템에 부정적인 영향을
          미칠 수 있어요.
        </TextArea>

        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>✔ 에너지 수준 유지</TextAreaTitle>
          규칙적으로 에너지를 공급받아 활발하게 일상생활을 영위하고, 치료
          과정에서 생길 수 있는 피로를 줄일 수 있어요.
        </TextArea>

        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>✔ 소화 기능 개선</TextAreaTitle>
          규칙적인 식사는 소화기관을 일정한 리듬으로 움직여 소화를 개선해요.
          항암치료로 소화 기능이 약해진 환자들에게 특히 도움이 돼요.
        </TextArea>
        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>✔ 면역력 향상</TextAreaTitle>
          규칙적이고 균형 잡힌 식사는 면역 시스템을 강화해 감염 등의
          위험으로부터 보호할 수 있어요.
        </TextArea>

        <TextBox className="mt-10  text-justify">
          규칙적인 식사는 신체뿐 아니라 정서적 안정감도 느낄 수 있게 해줍니다.
          그래서 치료 과정에 대해 더욱 긍정적인 마음으로 임할 수 있게 해줘요.
        </TextBox>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
