import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import Day9Pic from "./Day9Pic.png";
import Day9Pic2 from "./day9Pic2.png";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "../../component/Layout/Titles/TextAreaTitle";

export default function Day9Step2(props: any) {
  // Props;
  const { onNext, onPrev, data } = props;

  return (
    <>
      <MainCard type="infomation">
        <InfomationTitle>
          운동을 <br /> 방해하는 요인 2
        </InfomationTitle>
        <TextBox className="mt-10 text-justify">
          <div className="flex justify-center mb-10">
            <img
              src={data === "예" ? Day9Pic2 : Day9Pic}
              alt="Day9Pic"
              className="rounded-xl w-[200px] "
            />
          </div>
          가끔은 마음먹은 대로 모든 것이 순조롭게 흘러가지 않는 날들이 있지만,
          포기하지 않는 것이 중요합니다. 실천을 방해하는 장애물을 차근차근
          탐색하며, 이를 어떻게 해결할 수 있을지 고민해 보겠습니다.
        </TextBox>

        <TextArea className="mt-5  text-justify">
          암 환자들이 운동할 때 종종 마주치는 몇 가지 어려움들을 살펴보고, 이 중
          나에게 해당하는 부분이 있는지 확인해 보세요. <br />
          그리고 그 어려움을 조금 더 수월하게 극복할 수 있는 방법에 대해 생각해
          봅시다.
        </TextArea>
        <TextArea className="mt-10  text-justify">
          <TextAreaTitle>✔ 심리적 스트레스</TextAreaTitle>
          진단과 치료가 가져오는 스트레스와 불안감은 운동에 대한 동기를 떨어뜨릴
          수 있어요. 상담을 통해 마음의 부담을 줄이고 운동에 대한 의욕을
          되찾아보세요.
        </TextArea>
        <TextArea className="mt-5  text-justify">
          <TextAreaTitle>✔ 부작용</TextAreaTitle>
          항암 치료로 인한 부작용(예: 구토, 설사, 식욕 부진 등)이 운동하는 데
          장애가 될 수 있어요. 적절한 식단과 영양 보충제를 활용해 이러한
          부작용을 완화하고, 운동 능력을 키워 보세요.
        </TextArea>
        <TextArea className="mt-5  text-justify">
          <TextAreaTitle>✔ 의료진과의 의사소통 부족</TextAreaTitle>
          어떤 운동이 좋고, 얼마나 할 수 있는지에 대한 분명한 안내가 없으면
          운동을 시작하기 어려울 수 있어요. 담당 의사나 간호사와 상담하여 나에게
          맞는 운동 계획을 수립해 보세요.
        </TextArea>
        <TextArea className="mt-5  text-justify">
          이렇게 마음을 다잡고, 가능한 방법을 탐색하면서, 나의 건강한 삶을 향해
          한 걸음씩 나아갈 수 있어요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
