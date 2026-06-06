import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "../../component/Layout/TextArea";
import TextAreaTitle from "../../component/Layout/Titles/TextAreaTitle";
import ImageBox from "../../component/ImageBox";
import Day8Pic1 from "./day8Pic1.png";
import Day8Pic2 from "./day8Pic2.png";

export default function Day8Step2(props: any) {
  const { onNext, data, onPrev } = props;

  const isCheck = data === "예";

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <TextBox className="">
          {isCheck ? (
            <>
              <ImageBox imgSrc={Day8Pic1} />
              계획하신 대로 잠을 푹 주무셨군요! <br />
              앞으로도 꾸준히 숙면을 취할 수 있기를 바라요.
            </>
          ) : (
            <>
              <ImageBox imgSrc={Day8Pic2} />
              하루 아침에 습관을 바꾸는 것은 쉽지 않은 일이에요. 수면 습관을
              바꾸기 위해 노력했지만, 계획대로 되지 않을 때는 실망감도 느껴질
              거예요. <br />
            </>
          )}
        </TextBox>
        {isCheck ? (
          <>
            {/* 예 선택 */}
            <TextArea className="mt-10">
              수면 시간과 수면의 질이 계속해서 좋아진다면 다음과 같은 효과를
              얻을 수 있어요.
            </TextArea>
            <TextArea className="mt-10">
              <TextAreaTitle>✔ 깊은 수면의 중요성</TextAreaTitle>
              잠은 여러 단계로 나누어져 있는데 그 중 깊은 수면 동안에는 피로
              회복, 세포 재생 등이 이루어지고 에너지가 충전 돼요. 매일 충분한
              수면 시간을 채우는 것만큼 잠을 깊게 자는 것도 중요해요. 이를 위해
              좋은 수면환경을 만드는 것이 도움이 될 수 있어요.
            </TextArea>
            <TextArea className="mt-5">
              <TextAreaTitle>✔ 수면과 인지기능</TextAreaTitle>
              잠을 자는 동안 우리의 뇌는 전날의 정보를 처리하고 기억 저장소로
              옮기는 과정을 수행해요. 이 과정에서 우리의 경험과 정보가
              재구성되어 문제 해결 능력과 창의력이 향상되며, 새로운 정보를 더 잘
              이해하고 기억할 수 있게 돼요.
            </TextArea>
            <TextArea className="mt-5">
              <TextAreaTitle>✔ 수면과 정신적 건강</TextAreaTitle>
              잠을 자는 동안 뇌는 정서 반응을 조절하고 처리하는 데 필요한 정보를
              재조정해요. 스트레스를 경감시키고 긍정적 감정을 증가시키는 데
              중요한 역할을 하는 아미그달라와 뇌의 전달체계는 잠을 충분히 잘 때
              더 효과적으로 작동해요.
            </TextArea>
          </>
        ) : (
          <>
            <TextArea className="mt-10">
              습관을 바꾸는 것은 쉬운 일이 아니지만, 도움이 될만한 방법 몇
              가지를 소개할게요.
            </TextArea>
            <TextArea className="mt-10">
              <TextAreaTitle>✔ 작은 변화부터 시작하기</TextAreaTitle>한 번에 큰
              변화를 시도하기보다는, 작은 변화부터 시작하는 것이 좋아요. <br />
              예를 들어, 일찍 자기 위해 평소보다 15분 빨리 잠자리에 들어보세요.
              그 다음 주에는 15분을 더 추가하고, 이런 식으로 점진적으로 목표
              시간에 도달하도록 해보세요.
            </TextArea>
            <TextArea className="mt-10">
              <TextAreaTitle>✔ 실패를 받아들이기</TextAreaTitle>
              항상 계획을 완벽하게 따르지 못할 수 있어요. 이것은 실패가
              아니에요. <br />
              때론 계획대로 되지 않을 수도 있음을 받아들이고 자신을 탓하지
              않도록 하세요. <br />
              대신, 다음날은 더 나은 날이 될 것이라는 긍정적인 자세를
              유지하세요.
            </TextArea>
            <TextArea className="mt-10">
              <TextAreaTitle>✔ 전문가와 상담하기</TextAreaTitle>
              만약 계획에 따르는 것이 어려운 경우, 또는 수면 문제가 계속되는
              경우에는 담당의사 또는 수면전문 심리상담가와 상의하는 것이 좋아요.
              맞춤식의 조언과 효과적인 방법을 제공해 줄 거예요.
            </TextArea>
          </>
        )}
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
