import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import SubTitle from "@/app/webview/coaching/component/Layout/SubTitle";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import useAccountName from "@/hooks/useAccountName";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import ImageBox from "../../component/ImageBox";
import StartPic from "./startPic.png";

export default function StartDayStep2(props: any) {
  const { step1, onNext, onPrev } = props;

  //  선택된 step1 정보
  const selectedText = step1.extra ? step1.extra : step1.value;

  const accountName = useAccountName();

  return (
    <>
      <MainCard coachingType="A">
        <SubTitle className="text-center">
          {accountName}님에게 중요한 삶의 가치는
          <br />
          <span className="text-camaColor1 mx-1">{selectedText}</span>
          입니다.
        </SubTitle>

        <TextBox className="mt-10">
          <ImageBox imgSrc={StartPic} />
          {selectedText}을(를) 실현하는 것에 식사습관은 어떤 기여를 하게 될까요?
        </TextBox>
        <TextArea className="mt-10 text-justify">
          건강한 식사습관은 인생의 기반을 다지는 데 큰 도움이 돼요. 올바른
          식사습관은 우리가 더욱 건강한 삶을 영위할 수 있도록 도와주죠.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          그리고 가족들과 함께하는 소중한 시간, 경제적인 여유, 활기찬 일상생활,
          정서적 안정, 신체적 건강 등 인생의 다양한 가치들을 실현할 수 있는
          기반이 될 거예요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
