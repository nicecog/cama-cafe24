import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";
import Day10Pic from "./day10Pic.png";
import TextArea from "../../component/Layout/TextArea";
import TextBox from "../../component/Layout/TextBox";

export default function Day10Step2(props: any) {
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <InfomationTitle>
          자기 전 <br />
          음식섭취
        </InfomationTitle>
        <TextBox className="mt-10 !text-camaColor">
          <div className="flex justify-center mb-10">
            <img src={Day10Pic} alt="Day10Pic" className="rounded-xl" />
          </div>
          저녁을 많이 먹거나 잠자리에 들기 한두시간 전에 음식을 섭취하면 수면의
          질이 나빠질 수 있습니다.
        </TextBox>

        <TextArea className="mt-10">
          위 속에 음식물이 잔뜩 들어간 상태면, 잠을 자는 동안에도 위는 계속
          연동운동을 하게 되니 수면의 질은 떨어지게 됩니다.
        </TextArea>
        <TextArea className="mt-10">
          배가 너무 고픈 것도 잠을 방해할 수 있어요. 밤 시간에 배가 고프다면
          견과류나 따뜻한 우유와 같이 간단히 허기를 달랠 수 있는 정도로 드시는
          것을 추천합니다.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
