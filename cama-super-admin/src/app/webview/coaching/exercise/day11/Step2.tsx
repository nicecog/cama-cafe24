import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "../../component/Layout/Titles/TextAreaTitle";
import Day11Pic from "./day11.png";
import ImageBox from "../../component/ImageBox";

export default function Day11Step2(props: any) {
  // Props;
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation">
        <InfomationTitle>
          운동할 때의 <br />
          주의사항 1
        </InfomationTitle>
        <TextBox className="mt-10 text-justify">
          <ImageBox imgSrc={Day11Pic} />
          운동이 건강에 도움이 되는 것은 분명하지만 환자이기 때문에 조심해야 할
          것들이 있어요. 다음과 같은 몇 가지 주의사항을 참고해 보세요.
        </TextBox>

        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 의사와 상의</TextAreaTitle>
          암과 관련된 치료(화학 치료, 방사선 치료 등)가 운동에 미치는 영향을
          정확히 알기 위해서는 반드시 담당 의사와 상의해야 해요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 부작용 검토</TextAreaTitle>암 치료로 인한
          부작용(피로, 무기력, 근육 약화 등)을 고려하여 운동 계획을 세워야 해요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 적절한 운동 선택</TextAreaTitle>암 치료로 인한 어떤
          운동은 본인에게 적합하지 않을 수 있으므로, 개인의 상태와 필요에 맞는
          운동을 선택해야 해요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
