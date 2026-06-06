import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import Day13Pic from "./day13Pic.png";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ImageBox from "../../component/ImageBox";
export default function Day13Step2(props: any) {
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <InfomationTitle className="!text-[24px]">
          시간을 확인하기
        </InfomationTitle>
        <TextBox className="mt-10">
          <ImageBox imgSrc={Day13Pic} className={"w-[180px]"} />
          잠자리에서 시간을 자주 확인하는 것은 불면증을 악화시키는 원인이 되기도
          합니다.
        </TextBox>

        <TextArea className="mt-10">
          시계를 보며 "아직도 잠들지 못했네.", <br />
          "오늘은 잠을 못 자겠다!"와 같은 생각으로 더욱 불안해지게 됩니다.
        </TextArea>
        <TextArea className="mt-10">
          시간을 확인하려고 눈을 뜨고 핸드폰을 켜면서 발생하는 빛은 멜라토닌
          분비를 방해하여 자연스러운 수면 리듬을 깨뜨릴 수 있어요.
        </TextArea>
        <TextArea className="mt-10">
          시간을 확인하는 것 자체는 수면에는 도움이 되지 않아요. 가능한 눈에
          보이는 곳에 벽시계나 스마트폰을 두지 않는 것이 좋습니다.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
