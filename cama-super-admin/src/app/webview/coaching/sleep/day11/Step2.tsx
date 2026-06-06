import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";

import TextArea from "../../component/Layout/TextArea";
import TextBox from "../../component/Layout/TextBox";

import Day11Pic from "./day11Pic.png";
import ImageBox from "../../component/ImageBox";

export default function Day11Step2(props: any) {
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <InfomationTitle>
          규칙적인 <br />
          운동하기
        </InfomationTitle>
        <TextBox className="mt-10">
          <ImageBox imgSrc={Day11Pic} />
          매일 조금씩이라도 규칙적인 운동을 하는 것은 수면에 큰 도움이 됩니다.
        </TextBox>

        <TextArea className="mt-10">
          운동은 스트레스와 불안을 낮추고, 전반적인 행복감을 높이며 우울증에
          걸릴 가능성을 낮춰 줘요.
        </TextArea>
        <TextArea className="mt-10">
          운동은 ‘자연 신경안정제’라고도 불립니다. 근육을 이완시키고 적절한
          피로감을 느끼게 해 깊은 수면을 유도하는 효과가 있어요.
        </TextArea>
        <TextArea className="mt-10">
          규칙적인 운동은 신체의 생물학적 시계, 즉 '순환 루틴'을 조정하는 데
          도움이 돼요. 이에 따라 수면 주기가 더 일정해질 수 있어요. 운동을 통해
          체력이 소모되면, 그 결과로 더 빨리 잠이 들 수 있어요.
        </TextArea>
        <TextArea className="mt-10">
          규칙적인 운동은 특히 잠들기 어려운 사람들에게 효과적이에요. 하지만
          심한 운동을 취침 직전에 하는 것은 수면에 더 방해가 될 수 있어요.
          그래서 운동 시간과 강도를 나에게 맞게 잘 조절하는 것이 중요해요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
