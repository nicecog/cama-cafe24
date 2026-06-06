import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "../../component/Layout/TextArea";
import StartPick from "./startPic.png";
import TextBox from "../../component/Layout/TextBox";
import ImageBox from "../../component/ImageBox";

export default function StartDayStep2(props: any) {
  // props
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard coachingType="A">
        <TextBox>
          <ImageBox imgSrc={StartPick} />
          건강한 수면은 풍요로운 삶의 기반이 됩니다.
        </TextBox>

        <TextArea className="mt-10 !font-bold">
          좋은 수면 습관은 건강한 삶을 영위하고, 가족과의 소중한 시간, 경제적
          여유, 활기찬 일상, 정서적 안정, 신체적 건강 등 인생의 다양한 가치를
          실현하는 데 큰 도움이 돼요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
