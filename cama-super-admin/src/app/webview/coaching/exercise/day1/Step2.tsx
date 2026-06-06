import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";
import ImageBox from "../../component/ImageBox";

import Day1Pic1 from "./day1_1.png";
import Day1Pic2 from "./day1_2.png";

export default function Day1Step2(props: any) {
  // Props;
  const { onNext, onPrev, step1 } = props;

  return (
    <>
      <MainCard coachingType="C" type="infomation">
        <InfomationTitle>
          운동이 부족할 때<br /> 생기는 문제
        </InfomationTitle>

        <TextBox className="mt-10">
          {step1 === "예" ? (
            <>
              <ImageBox imgSrc={Day1Pic1} />
              <div className="font-bold text-camaColor mb-5">
                "정말 잘하고 계시네요! <br />
                꾸준한 운동은 건강을 유지하고 삶의 질을 향상시키는데 큰 도움이
                됩니다."
              </div>
            </>
          ) : (
            <>
              <ImageBox imgSrc={Day1Pic2} />
              <div className="font-bold text-camaColor mb-5 tracking-tighter">
                "아직 시작하지 않으셨군요. 하지만 괜찮습니다! 오늘부터
                '카마플러스'와 함께 건강한 운동 습관을 만들어봐요."
              </div>
            </>
          )}
          운동과 같은 신체 활동은 암 환자에게 많은 도움이 됩니다. 운동이
          부족하면 다음과 같은 문제가 생길 수 있어요.
        </TextBox>

        <TextArea className="mt-10">
          <TextAreaTitle>✔ 근육감소 및 노화</TextAreaTitle>
          운동이 부족하면 근육량이 줄어들고 신체가 빠르게 노화될 수 있어요. 암을
          치료하는 과정에서 환자들은 신체적으로 많이 약해져 있으므로 근력 감소
          및 노화와 같은 증상이 나타나기 쉬워요.
        </TextArea>
        <TextArea className="mt-10">
          <TextAreaTitle>✔ 면역기능 약화</TextAreaTitle>
          적절한 운동은 신체의 면역력을 높여줘요. 하지만, 운동이 부족하면
          면역력이 약해져 암 치료 과정에서의 감염 위험이나 합병증이 생길
          가능성이 높아져요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
