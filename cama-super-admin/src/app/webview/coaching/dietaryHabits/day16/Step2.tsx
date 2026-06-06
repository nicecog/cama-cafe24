import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import useAccountName from "@/hooks/useAccountName";

import Day16Pic from "./day16.png";
import ImageBox from "../../component/ImageBox";

export default function Day16Step2(props: any) {
  // Props;
  const { onNext, onPrev } = props;

  const accountName = useAccountName();
  return (
    <>
      <MainCard coachingType="B" type="infomation">
        <TextBox className="mt-10 text-justify">
          <ImageBox imgSrc={Day16Pic} />
          식사 습관이 개선되었다면, 그것은
          {` ${accountName}`}님이 건강한 식사를 위해 노력한 결과 일 거예요.
        </TextBox>

        <TextArea className="mt-10 text-justify">
          치료 효과를 증가시키고 건강한 일상을 만들기 위해서는 개선된 식습관을
          지속적으로 유지하는 것이 중요해요.
        </TextArea>

        <TextArea className="mt-10 text-justify">
          만약 잘 진행하지 못한 미션이 있더라도 너무 걱정하지 마세요. <br />
          우리는 매일 세 번 이상 식사할 기회가 있고, 매번 식사할 때마다 조금씩
          변화를 시도할 수 있어요.
        </TextArea>

        <TextArea className="mt-10 text-justify">
          건강한 식사습관을 갖는 게 최고의 치료 방법이 될 수 있다는 점을 잊지
          마세요!
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
