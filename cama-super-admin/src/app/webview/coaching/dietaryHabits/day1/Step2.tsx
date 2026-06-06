import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import day1Pic from "./day1Pic.png";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";
import ImageBox from "../../component/ImageBox";

export default function StartDayStep2(props: any) {
  // Props;
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        <InfomationTitle>건강한 식습관</InfomationTitle>
        <TextBox className="mt-10 text-justify">
          <ImageBox imgSrc={day1Pic} />
          <div className="mb-5 ">건강한 식습관은 치료만큼 중요해요.</div>
        </TextBox>
        <TextArea className="mt-5 text-justify">
          건강한 식사 습관의 중요성은 다음과 같습니다.
        </TextArea>

        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>첫 번째</TextAreaTitle>
          영양 상태를 잘 유지하는 것은 암과 치료의 부작용에 맞서 싸우는 데
          필수적이에요. <br />
          영양소가 풍부한 식단은 필요한 미네랄과 비타민을 제공하여 면역력을
          강화시켜 주어요.
        </TextArea>

        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>두 번째</TextAreaTitle>암 치료로 인한 부작용을
          효과적으로 관리할 수 있도록 도와줘요. 식욕 부진, 구토, 설사 등의
          부작용을 관리하기 위해 고단백, 고열량 식단을 포함한 특별한 식단이
          필요할 수 있어요. <br />
          고단백, 고열량 식품은 체중감소를 방지하고, 항산화제가 풍부한 식품은
          세포의 손상을 줄여줄 수 있어요.
        </TextArea>

        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>세 번째</TextAreaTitle>감염 위험을 줄일 수 있어요. 좋은
          영양 상태는 면역 체계를 강화해 외부 감염으로부터 보호하고, 이미 감염된
          질병의 진행을 늦추는 데 도움이 돼요. 프로바이오틱스나 고섬유질 식품은
          장 건강을 지켜 감염 위험을 낮춰줘요.
        </TextArea>

        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>네 번째</TextAreaTitle>
          항암 치료로 손상된 세포의 빠른 회복을 도와줘요. 적절한 영양 섭취는
          항암 치료로 인해 영향을 받은 건강한 세포 및 손상된 세포의 재생을
          지원해요. <br />
          오메가-3 지방산과 아미노산 같은 영양소는 세포의 복구와 재생 과정에 큰
          도움이 돼요.
        </TextArea>

        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>다섯 번째</TextAreaTitle>
          식사는 기분을 좋게 하고 일상에 활력을 줘요. 에너지가 충분해야 치료를
          받으며 긍정적인 기분을 유지할 수 있어요. <br />
          암치료에 중요한 스트레스 관리와 적절한 신체 활동을 위해서도 영양가
          있는 식사는 매우 중요해요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
