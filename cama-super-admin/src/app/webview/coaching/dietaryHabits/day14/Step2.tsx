import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";

import Day14Pic from "./day14.png";
import ImageBox from "../../component/ImageBox";

export default function Day14Step2(props: any) {
  // Props;
  const { onNext, onPrev, step1 } = props;

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        <InfomationTitle>과식하지 않기</InfomationTitle>
        {step1 === "예" ? (
          <>
            <TextBox className="mt-10 text-justify">
              <ImageBox imgSrc={Day14Pic} />
              <div className="font-bold text-camaColor mb-5">
                때때로 과식을 하시는 군요!
              </div>
              과식을 피하는 것이 왜 중요한지 함께 알아봐요.
            </TextBox>
          </>
        ) : (
          <>
            <TextBox className="mt-10 text-justify">
              <ImageBox imgSrc={Day14Pic} />
              <div className="font-bold text-camaColor mb-5">
                적절하게 식사를 하고 있네요.
              </div>
              과식을 피하는 것의 중요성에 대해 함께 알아봐요!
            </TextBox>
          </>
        )}
        <TextArea className="mt-10 text-justify">
          치료 효과를 높이고 건강을 회복하는 데에 있어 충분한 영양분을 섭취하는
          것은 매우 중요해요. 하지만 충분한 영양분도 너무 과하면 오히려 역효과를
          낼 수 있어요. 과식을 하지 않으면 어떤 점이 좋은지 알아보기로 해요.
        </TextArea>

        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 영양소 흡수 최적화</TextAreaTitle>
          과식은 소화 시스템에 부담을 주며, 영양소의 흡수를 방해할 수 있어요. 암
          환자에게는 영양소를 효율적으로 흡수하는 것이 중요하므로 적당한 양을
          섭취하는 것이 좋아요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 부작용 관리</TextAreaTitle>
          과식은 항암치료의 부작용(예: 구역감, 식욕 부진 등)을 더욱 악화시킬 수
          있어요. 적절한 양의 식사를 통해 이러한 부작용을 더 쉽게 관리할 수
          있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 체중 관리</TextAreaTitle>
          과식은 체중을 증가시킬 수 있어요. 이는 암의 치료 결과와 재발 위험에
          영향을 줄 수 있어요. 적절한 체중 관리는 암 환자에게 중요해요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 항암치료 효과 향상</TextAreaTitle>
          과식으로 인한 혈당 수치의 상승은 항암 치료 효과를 저하할 수 있어요.
          오히려 적당한 식사가 치료 효과를 높일 수 있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 간과 소화기 건강</TextAreaTitle>
          과식은 간과 소화기에 부담을 줄 수 있어요. 이 기관들은 암 치료에 중요한
          역할을 해요. 적당한 식사를 유지하면 이 기관들의 건강을 보호하고 치료에
          도움을 줄 수 있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 면역기능 강화</TextAreaTitle>
          과식은 면역 시스템에도 부정적인 영향을 줄 수 있어요. 적절한 식사량과
          균형 잡힌 영양 섭취는 면역 기능을 강화하는 데 도움이 돼요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
