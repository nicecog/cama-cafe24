import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";

import TextArea from "../../component/Layout/TextArea";
import TextBox from "../../component/Layout/TextBox";

import Day7Pic from "./day7Pic.png";
import ImageBox from "../../component/ImageBox";

export default function Day7Step2(props: any) {
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <InfomationTitle>
          불규칙한 <br />
          수면 패턴
        </InfomationTitle>
        <TextBox className="mt-10">
          <ImageBox imgSrc={Day7Pic} />
          규칙적이지 않은 취침-기상 시간은 우리의 수면 리듬을 방해해요.
        </TextBox>

        <TextArea className="mt-10">
          우리 뇌에는 생체 시계가 있어요. 생체 시계는 잠을 자고 일어나는
          시간뿐만 아니라 식사 시간, 에너지를 많이 사용하는 시간 등을 조율하게
          돼요. 그래서 하루 주기 리듬에서 수면이 어느 시간대에 위치하는지도
          중요하게 작용해요. 취침 시간과 기상 시간이 자주 바뀌게 되면 생체
          시계에 혼란을 가져다주고, 피로감은 더 증가해요.
        </TextArea>
        <TextArea className="mt-10">
          결국, 사람은 모두 하루 주기 리듬에 따라 낮에는 활동하고 밤에는 잠을
          자야 정상적인 컨디션을 유지할 수 있어요.
        </TextArea>
        <TextArea className="mt-10">
          건강한 수면 패턴을 유지하기 위해서는 가능한 매일, 같은 시간에 잠자리에
          들어가고 일어나는 것이 좋아요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
