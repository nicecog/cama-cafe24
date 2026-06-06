import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";

import Day10Pic from "./day10.png";
import ImageBox from "../../component/ImageBox";

export default function Day10Step2(props: any) {
  // Props;
  const { onNext, onPrev, step1 } = props;

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        {step1 === "예" ? (
          <>
            <TextBox className="mt-10  text-justify">
              <ImageBox imgSrc={Day10Pic} />
              <div className="font-bold text-camaColor mb-5 text-center">
                이미 잘 알고 있군요!
              </div>
              본인이 알고 있는 정보와 아래 내용을 비교해 보시고, 올바른 관리를
              지속해서 유지하실 수 있기를 바라요.
            </TextBox>

            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 손 씻기</TextAreaTitle>
              식재료를 준비하기 전과 후에는 비누와 물로 최소 20초 이상 손을
              꼼꼼히 씻어요.
            </TextArea>

            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 냉장실 온도 관리</TextAreaTitle>
              냉장실의 온도를 4℃ 이하로 유지해 음식을 안전하게 보관하세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 음식 온도 유지</TextAreaTitle>
              뜨거운 음식은 40℃ 이상, 차가운 음식은 4℃ 이하에서 보관해야 해요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 해동 주의 사항</TextAreaTitle>
              고기, 생선, 닭고기 등을 해동할 때는 전자레인지나 냉장고를
              이용하세요. 절대로 실온에서 해동하지 마세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 재냉동 금지</TextAreaTitle>한 번 해동한 식품은
              다시 냉동하지 않아야 해요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 잎채소 씻기</TextAreaTitle>
              잎채소는 흐르는 물로 꼼꼼하게 씻으세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 조리 도구 분리 사용</TextAreaTitle>
              음식 종류에 따라 조리 도구를 분리해 사용하세요. 맛을 본 후에는 그
              도구를 다시 사용하지 않도록 해요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 냄새 검사</TextAreaTitle>
              이상한 냄새가 나는 음식은 맛보지 않고 바로 버리세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 조리 후 빠른 섭취</TextAreaTitle>
              조리한 음식은 가능한 한 빨리 섭취하거나 적절한 온도에서
              보관하세요. 이렇게 하면 미생물의 증식을 최소화할 수 있어요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 조리 음식의 완전한 익힘</TextAreaTitle>
              고기나 달걀 등은 반드시 완전히 익혀 섭취하세요. 이는 살모넬라나
              대장균(E. coli) 등의 미생물 감염 위험을 줄여줘요.
            </TextArea>
          </>
        ) : (
          <>
            <TextBox className="mt-10  text-justify">
              <ImageBox imgSrc={Day10Pic} />
              <div className="font-bold text-camaColor mb-5  text-center">
                식재료 관리는 암환자에게 <br />
                특히 더 중요해요.
              </div>
              미생물에 의한 감염을 예방하고 음식의 질을 유지하기 위해 다음과
              같은 방법들을 실천해 보세요.
            </TextBox>

            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 손 씻기</TextAreaTitle>
              식재료를 준비하기 전과 후에는 비누와 물로 최소 20초 이상 손을
              꼼꼼히 씻어요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 냉장실 온도 관리</TextAreaTitle>
              냉장실의 온도를 4℃ 이하로 유지해 음식을 안전하게 보관하세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 음식 온도 유지</TextAreaTitle>
              뜨거운 음식은 40℃ 이상, 차가운 음식은 4℃ 이하에서 보관해야 해요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 해동 주의 사항</TextAreaTitle>
              고기, 생선, 닭고기 등을 해동할 때는 전자레인지나 냉장고를
              이용하세요. 절대로 실온에서 해동하지 마세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 재냉동 금지</TextAreaTitle>한 번 해동한 식품은
              다시 냉동하지 않아야 해요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 잎채소 씻기</TextAreaTitle>
              잎채소는 흐르는 물로 꼼꼼하게 씻으세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 조리 도구 분리 사용</TextAreaTitle>
              음식 종류에 따라 조리 도구를 분리해 사용하세요. 맛을 본 후에는 그
              도구를 다시 사용하지 않도록 해요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 냄새 검사</TextAreaTitle>
              이상한 냄새가 나는 음식은 맛보지 않고 바로 버리세요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 조리 후 빠른 섭취</TextAreaTitle>
              조리한 음식은 가능한 한 빨리 섭취하거나 적절한 온도에서
              보관하세요. 이렇게 하면 미생물의 증식을 최소화할 수 있어요.
            </TextArea>
            <TextArea className="mt-10  text-justify">
              <TextAreaTitle>✔ 조리 음식의 완전한 익힘</TextAreaTitle>
              고기나 달걀 등은 반드시 완전히 익혀 섭취하세요. 이는 살모넬라나
              대장균(E. coli) 등의 미생물 감염 위험을 줄여줘요.
            </TextArea>
          </>
        )}
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
