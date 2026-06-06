import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";
import Day15Pic from "./day15Pic.png";
import ImageBox from "../../component/ImageBox";

export default function Day15Step2(props: any) {
  // Props;
  const { onNext, onPrev, step1 } = props;

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        <InfomationTitle>야식하지 않기</InfomationTitle>
        <TextBox className="mt-10 text-justify">
          <ImageBox imgSrc={Day15Pic} className="w-[200px]" />
          <div className="font-bold text-camaColor mb-5">
            {step1 === "예" ? (
              <>지난 주에 야식을 한 적이 있군요.</>
            ) : (
              <>야식을 하지 않는 건강한 식습관을 갖고 있네요!</>
            )}
          </div>
          야식을 피해야 하는 이유에 대해 함께 알아봐요!
        </TextBox>

        <TextArea className="mt-10 text-justify">
          밤에 야식을 먹는 것은 건강한 사람에게도 좋지 않지만, 특히 다음과 같은
          이유에서 암 환자에게는 더욱 추천하지 않아요.
        </TextArea>

        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 신체 리듬과 호르몬 불균형</TextAreaTitle>
          밤에 음식을 섭취하면 신체의 일주기 리듬에 방해가 되어 수면의 질을
          떨어뜨리고 충분한 휴식을 취하는 데 어려움을 겪을 수 있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 체중 증가와 혈당 조절</TextAreaTitle>
          야식은 체중 증가를 유발하고 암 치료의 효과나 재발 위험에 영향을 줄 수
          있으며, 혈당 조절에도 부정적 영향을 줄 수 있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 소화기 건강</TextAreaTitle>
          밤늦게 음식을 섭취하면 소화기관에 부담을 주고, 암치료 중에 발생할 수
          있는 메스꺼움이나 위염 등의 증상을 악화시킬 수 있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 항암치료 효과 저하</TextAreaTitle>
          특정 항암치료는 식사 시간이 중요할 수 있어요. 야식을 먹으면 이러한
          치료의 효과를 저하할 수 있게 돼요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 면역 시스템 악화</TextAreaTitle>
          잘못된 식사 시간은 면역 시스템에도 영향을 미칠 수 있어요. 암
          환자에게는 강한 면역 시스템이 필요하므로, 이를 방해하는 야식은 피하는
          것이 좋아요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
