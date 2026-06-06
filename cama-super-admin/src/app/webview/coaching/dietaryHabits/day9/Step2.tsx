import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";
import useAccountName from "@/hooks/useAccountName";

import Day9_1 from "./day9_1.png";
import Day9_2 from "./day9_2.png";
import ImageBox from "../../component/ImageBox";

export default function Day9Step2(props: any) {
  // Props;
  const { onNext, onPrev, step1 } = props;

  const accountName = useAccountName();

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        {step1 === "예" ? (
          <>
            <TextBox className="mt-10  text-justify">
              <ImageBox imgSrc={Day9_1} />
              식습관 변화 도전을 계획대로 잘 수행해 오셨다고 답변해 주셨네요.
            </TextBox>
            <TextArea className="my-10  text-justify">
              어떤 부분들이 계획을 지키는 데 도움이 되었나요? <br /> <br /> 다음
              보기 중에서 골라보세요.
            </TextArea>

            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 정확한 목표 설정</TextAreaTitle>
              나만의 식습관 목표를 구체적이고, 측정 가능한 방식으로 설정했다.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 일정 관리 앱 이용</TextAreaTitle>
              식사 시간, 메뉴 등을 일정 관리 앱이나 알람으로 설정해 일관성을
              유지했다.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 가족 및 친구들의 지원</TextAreaTitle>
              주변 사람들의 적극적인 지원과 격려가 있어 계획을 지키기 쉬웠다.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 다양한 식단 준비</TextAreaTitle>
              지겨워지지 않도록 다양한 메뉴를 준비하여 지속성을 높였다.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 자기 기록과 리뷰</TextAreaTitle>
              매일 혹은 주간 단위로 식습관을 기록하고 리뷰하여 어떤 부분이 잘
              되고 있는지, 무엇을 개선해야 하는지를 파악했다.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 보상 시스템 설정</TextAreaTitle>
              목표를 달성할 때마다 작은 보상을 주는 방식으로 동기를 높였다.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 실용적인 레시피 활용</TextAreaTitle>
              쉽고 빠르게 만들 수 있는 레시피를 활용하여 일상 속에 식습관 변화를
              쉽게 적용했다.
            </TextArea>
          </>
        ) : (
          <>
            <TextBox className="mt-10  text-justify">
              <ImageBox imgSrc={Day9_2} />
              식습관을 변화시키기는 쉬운 일이 아니에요. 그러나 결코 실망하거나
              포기하지 마세요!
            </TextBox>
            <TextArea className="  my-10  text-justify">
              {accountName}님께 도움이 될 수 있는 몇 가지 방법을 소개해
              드릴게요.
            </TextArea>

            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 목표 설정의 정확성</TextAreaTitle>
              자신만의 식습관 목표를 구체적이고 측정할 수 있게 설정해 보세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 일정 관리 앱 사용</TextAreaTitle>
              식사 시간과 메뉴를 일정 관리 앱이나 알람으로 설정하여 일관성을
              유지해 보세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 가족이나 친구들의 지원 요청</TextAreaTitle>
              주변 사람들에게 지원과 응원을 요청해 보세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 다양한 식단 준비</TextAreaTitle>
              다양한 메뉴를 준비해 지루함을 방지하고 지속 가능성을 높여 보세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 자기 기록과 리뷰</TextAreaTitle>
              매일 혹은 주간 단위로 식습관을 기록하고 검토하며 잘 진행되고 있는
              점과 개선할 필요가 있는 부분을 파악해 보세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 보상 시스템 설정</TextAreaTitle>
              목표 달성 시 작은 보상을 통해 자신을 격려해 동기를 부여해 보세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 실용적인 요리법 활용</TextAreaTitle>
              간편하고 신속하게 준비할 수 있는 요리법을 활용해 보세요.
            </TextArea>
          </>
        )}
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
