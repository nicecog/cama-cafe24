import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";
import MissionTitle from "../../component/Layout/MissionTitle";
import TextArea from "../../component/Layout/TextArea";
import TextAreaTitle from "../../component/Layout/Titles/TextAreaTitle";
import ImageBox from "../../component/ImageBox";
import Day1Pic1 from "./day1Pic1.png";
import Day1Pic2 from "./day1Pic2.png";

// 1일차
export default function StartDayStep2(props: any) {
  // Props;
  const { step1, onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation">
        <InfomationTitle>수면의 중요성</InfomationTitle>

        <TextBox className="mt-10">
          <MissionTitle className="my-5">
            {step1 === "예" ? (
              <>충분한 수면을 취하고 있네요!</>
            ) : (
              <>
                평소 수면에 만족을 못 하고
                <br />
                계시네요.
              </>
            )}
          </MissionTitle>
          <ImageBox imgSrc={step1 === "예" ? Day1Pic1 : Day1Pic2} />
          <div className="!text-camaColor font-bold mb-5">
            세계보건기구는 성인의 하루 적정 수면 시간이 7~9시간이라고 권고하고
            있어요.
          </div>
          사람에 따라 약간의 차이는 있지만 하루 7시간 미만으로 잠을 자면 수면
          부족 현상이 나타날 수 있어요.
        </TextBox>
        <TextArea className="mt-10 text-camaColor font-bold">
          수면 부족이 오래 지속되면 다음과 같은 문제가 생길 수 있습니다.
        </TextArea>

        <TextArea className="mt-5">
          <TextAreaTitle>✔ 신체건강</TextAreaTitle>
          <div className="mt-5">
            장기간의 수면 부족은 심장병, 고혈압, 당뇨병, 그리고 일부 암과 같은
            심각한 건강 문제를 일으킬 수 있어요. 이 외에도, 수면 부족은 면역
            체계를 약화해 감기와 같은 감염성 질환에 더 쉽게 걸리게 해요.
          </div>
        </TextArea>

        <TextArea className="mt-5">
          <TextAreaTitle>✔ 정신건강</TextAreaTitle>
          <div className="mt-5">
            수면 부족은 우울증, 불안 장애, 그리고 다른 정신 건강 문제를 유발할
            수 있어요. 이뿐만 아니라, 스트레스와 분노를 쉽게 느끼게 되고 감정
            기복이 심해질 수도 있어요.
          </div>
        </TextArea>
        <TextArea className="mt-5">
          <TextAreaTitle>✔ 기억력과 집중력</TextAreaTitle>
          <div className="mt-5">
            수면은 학습과 기억에 중요한 역할을 해요. 수면이 부족하면, 뇌에서
            새로운 정보를 처리하고 기억하는 능력이 저하될 수 있어요.
          </div>
        </TextArea>
        <TextArea className="mt-5">
          <TextAreaTitle>✔ 사고 위험 증가</TextAreaTitle>
          <div className="mt-5">
            수면 부족이 지속되면 반응 시간이 느려져요. 이는 특히 운전 중에
            위험할 수 있어요. 실제로, 운전 중 수면 부족은 음주와 유사한 효과를
            가지며, 교통사고의 주요 원인 중 하나입니다.
          </div>
        </TextArea>
        <TextArea className="mt-5">
          <TextAreaTitle>✔ 체중 증가</TextAreaTitle>
          <div className="mt-5">
            수면 부족은 식욕을 증가시키고 포만감과 관련된 호르몬의 균형을
            깨뜨려요. 이는 과식을 유발하고 체중 증가를 초래할 수 있어요.
          </div>
        </TextArea>
      </MainCard>

      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
