import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import Day13Pic from "./Day13Pic.png";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";

export default function Day13Step2(props: any) {
  // Props;
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation">
        <InfomationTitle className="tracking-tighter">
          운동할때의 <br />
          주의사항2
        </InfomationTitle>
        <TextBox className="mt-10">
          <div className="flex justify-center mb-10">
            <img src={Day13Pic} alt="Day13Pic" className="rounded-xl  " />
          </div>
          이전에 운동을 하면서 주의하면 좋을 것들을 알려드렸어요. 오늘도
          추가적인 몇 가지 주의 사항을 알려드릴게요!
        </TextBox>

        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 체력 확인</TextAreaTitle>
          운동을 시작하기 전, 중간, 후에 자신의 체력을 점검하고 이상 유무를
          확인해야 해요.
        </TextArea>

        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 부상 예방</TextAreaTitle>암 환자는 평소보다 쉽게 다칠
          수 있으므로, 스트레칭이나 준비운동을 철저히 해야 해요.
        </TextArea>

        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 적절한 강도의 운동</TextAreaTitle>
          너무 강한 운동은 암 환자에게 부담이 될 수 있으므로, 적절하게 중등도의
          운동을 하는 것이 좋아요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
