import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ImageBox from "../../component/ImageBox";

import Day15Pic from "./day15Pic.png";

export default function Day15Step2(props: any) {
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <InfomationTitle className="!text-[24px]">
          저녁 시간의 <br />
          격한 운동
        </InfomationTitle>
        <TextBox className="mt-10">
          <ImageBox imgSrc={Day15Pic} />
          앞서 우리는 규칙적인 운동이 수면에 도움이 된다는 것을 배웠어요. 그러나
          늦은 저녁 시간, 특히 자기 전 2시간 이내에 하는 격한 운동은 잠을 방해할
          수 있어요.
        </TextBox>

        <TextArea className="mt-10">
          격한 운동은 스트레스 호르몬인 코르티솔의 분비를 증가시키는데, 이것으로
          인해 적절한 잠을 자지 못할 수도 있어요.
        </TextArea>
        <TextArea className="mt-10">
          또한 격한 운동은 체온을 상승시키고 심박을 빠르게 하며, 전반적인 에너지
          수준을 올라가게 하죠. 잠을 자기 위해서는 체온이 낮고 에너지 수준이
          떨어지는 것이 더 좋아요. 따라서 운동을 하더라도 가능한 취침 2시간
          이전에 끝내고, 격한 운동은 피하는 것을 추천해 드려요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
