import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";
import Day13Pic from "./day13Pic.png";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";
import ImageBox from "../../component/ImageBox";

export default function Day13Step2(props: any) {
  // Props;
  const { onNext, onPrev, data } = props;

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        <InfomationTitle>알코올</InfomationTitle>
        {data === "예" ? (
          <>
            <TextBox className="mt-10 text-justify">
              <ImageBox imgSrc={Day13Pic} />
              <div className="">
                그렇군요. 금주를 해야 하는 이유에 대해 알아봐요!
              </div>
            </TextBox>
          </>
        ) : (
          <>
            <TextBox className="mt-10 text-justify">
              <ImageBox imgSrc={Day13Pic} />
              <div className="">
                음주를 하지 않으셨군요! <br />
                금주가 왜 중요한지 함께 알아봐요.
              </div>
            </TextBox>
          </>
        )}

        <TextArea className="mt-10 text-justify">
          알코올이 건강에 좋지 않다는 것은 이미 알고 계실 텐데요, 특히 암
          환자에게는 알코올이 더욱 해로울 수 있습니다. <br />
          술을 멀리함으로써 얻을 수 있는 이점에 대해 알아보기로 해요.
        </TextArea>

        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 암 위험 감소</TextAreaTitle>
          알코올은 몇몇 암의 위험을 높일 수 있는 요인이에요. 특히, 구강암,
          식도암, 간암 등에 대한 위험이 커질 수 있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 항암치료 효과 향상</TextAreaTitle>
          알코올은 항암치료의 효과를 감소시킬 수 있어요. 술을 멀리함으로써 치료
          효과를 높일 수 있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 간 건강 유지</TextAreaTitle>
          알코올은 간에 부담을 주며, 암치료 중에는 간이 중요한 역할을 해요.
          알코올을 피하면 간 건강을 더 잘 유지할 수 있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 면역기능 강화</TextAreaTitle>
          알코올은 면역 시스템을 약화할 수 있어요. 강한 면역 시스템이 필요한 암
          환자에게 술을 피하는 것은 면역 기능을 강화하는 데 도움이 돼요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 영양 상태 개선</TextAreaTitle>
          알코올은 열량은 높지만, 영양소는 거의 없어요. 술을 피하면, 더 많은
          영양소를 섭취할 기회가 생겨요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 신체적 / 정신적 건강 향상</TextAreaTitle>
          술은 신체적, 정신적 건강에 부정적 영향을 줄 수 있어요. 술을
          멀리함으로써 정신 상태를 개선하고, 항암치료 중 나타날 수 있는 부작용을
          더 잘 관리할 수 있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 부작용 감소</TextAreaTitle>
          알코올은 구토, 식욕 부진 등 항암치료의 부작용을 악화시킬 수 있습니다.
          술을 피하면 이러한 부작용을 더욱 효과적으로 관리할 수 있어요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
