import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import Day5Pic from "./day5Pic.png";
import useAccountName from "@/hooks/useAccountName";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import ImageBox from "../../component/ImageBox";

export default function Day5Step2(props: any) {
  // Props;
  const { onNext, onPrev } = props;

  const accountName = useAccountName();

  return (
    <>
      <MainCard type="infomation">
        <InfomationTitle className="tracking-tighter">
          운동을 <br />
          방해하는 요인 1
        </InfomationTitle>
        <TextBox className="mt-10  text-justify">
          <ImageBox imgSrc={Day5Pic} />
          신체 활동이나 운동을 하는 데 여러 방해 요인들이 있습니다. <br />
          방해 요인을 없애거나 줄일만한 방법을 알려드릴게요. <br />
          {accountName}님이 할 수 있는 것들을 찾아보세요.
        </TextBox>

        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>✔ 피로감</TextAreaTitle>암 치료, 특히 항암화학요법이나
          방사선 치료는 신체적 피로를 증가시킬 수 있어요. 운동으로 피로감이
          쌓일까 봐 염려된다면, 짧은 시간 동안 여러 번 나눠서 운동해 보세요.
          그렇게 운동하면 피로를 덜 느끼고 꾸준히 해 나갈 수 있어요.
        </TextArea>

        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>✔ 신체적 제한</TextAreaTitle>암 치료나 암 자체로 인한
          신체적인 문제(예: 근육 손실, 뼈 약화, 통증 등)가 운동을 어렵게 만들 수
          있어요. 이런 경우 물리치료사나 운동 전문가의 지도를 받아보세요, 신체적
          제한을 고려한 안전하고 효과적인 운동방법을 배울 수 있어요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
