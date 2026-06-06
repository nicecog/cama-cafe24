import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextArea from "../../component/Layout/TextArea";
import Day4Pic from "./day4.png";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";
import TextBox from "../../component/Layout/TextBox";
export default function Day4Step2(props: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <InfomationTitle>걱정과 생각들</InfomationTitle>
        <TextBox className="mt-10">
          <div className="flex justify-center mb-10">
            <img src={Day4Pic} alt="day4" className="rounded-xl" />
          </div>
          치료 과정에서의 스트레스, 미래에 대한 걱정들이 많을지도 몰라요.
          <br />
          침대에 누우면 그런 걱정과 생각들이 더욱 몰려오기도 하죠.
          <br />
          그러나 잠자리에서 이런 저런 생각에 빠져드는 것은 수면에 매우 방해가
          됩니다.
        </TextBox>

        <TextArea className="mt-10">
          자려고 누웠을 때 이런저런 생각들이 떠오른다면, 자신의 호흡에 집중해
          보세요.
          <br /> 호흡에 주의를 기울이는 것만으로도 불필요한 생각들이 줄어들고
          쉽게 잠에 들 수 있습니다.
        </TextArea>

        <TextArea className="mt-10">
          꼭 고민해야 할 중요한 걱정거리가 있다면 잠자기 2~3시간 전에 책상에
          앉아 따로 메모해 보세요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
