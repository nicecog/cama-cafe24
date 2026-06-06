import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";
import Day9Pic from "./day9Pic.png";
import TextArea from "../../component/Layout/TextArea";
import TextBox from "../../component/Layout/TextBox";

export default function Day9Step2(props: any) {
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <InfomationTitle>
          불편한 <br />
          수면 환경
        </InfomationTitle>
        <TextBox className="mt-10">
          <div className="flex justify-center mb-10">
            <img src={Day9Pic} alt="day9" className="rounded-xl" />
          </div>
          수면 습관만큼이나 잠을 자는 환경도 중요해요. 너무 덥거나 추운 온도,
          소음, 밝은 빛 등은 수면을 방해할 수 있어요.
        </TextBox>

        <TextArea className="mt-10">
          방의 온도는 20도~24도 사이가 적당합니다. 밤에는 실내를 은은한 간접
          조명으로 비추고, 잠자리에 들 때 완전히 불을 끄는 것이 좋아요.
        </TextArea>
        <TextArea className="mt-10">
          외부에서 들어오는 빛을 차단하기 위해 암막 커튼이나 안대를 사용하는
          것도 도움이 돼요. 또한, 자신에게 편안한 베개와 이불을 사용하세요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
