import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "../../component/Layout/TextArea";
import TextBox from "../../component/Layout/TextBox";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";
import ImageBox from "../../component/ImageBox";

import StartPic from "./start1.png";

export default function StartDayStep2(props: any) {
  const { onNext, onPrev } = props;

  const onNextHandler = () => {
    onNext();
  };
  const onPrevHandler = () => {
    onPrev();
  };

  return (
    <>
      <MainCard coachingType="C">
        <InfomationTitle>운동의 역할</InfomationTitle>

        <TextBox className="mt-10  ">
          <ImageBox imgSrc={StartPic} />
          자신의 삶에서 중요한 가치 추구를 통해 더욱 의미있고 충족된 삶을 살아갈
          수 있게 됩니다. <br />
          가치를 추구하는 과정에서 운동과 같은 신체 활동이 어떤 도움이 될까요?
        </TextBox>
        <TextArea className="mt-10">
          운동은 삶의 기초를 만드는 데 매우 중요한 역할을 해요. 운동을 통해
          건강한 삶을 사는 것은, 가족과의 행복한 시간이나 경제적 안정, 활력있는
          일상생활, 심리적 안정, 신체적 건강 등 삶의 가치를 이루는 토대가 될
          거예요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNextHandler} onPrev={onPrevHandler} />
    </>
  );
}
