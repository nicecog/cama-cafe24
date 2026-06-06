import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";
import Card5Summary from "../../CardSummary/Card5";
import Footer from "../../component/Footer";
import ImporText from "../../component/ImportText";

export default function Step11() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Card5Summary onComplete={onNext}>
        <MissionTitle>3. 긴장을 풀어요.</MissionTitle>
        <TextArea className="mt-5 mb-5">
          나도 모르게 긴장하고 있을 때, 피로해지기 쉬워요. 그럴 땐
          마음근육훈련에서 배웠던 <ImporText>복식호흡과 명상</ImporText>으로
          몸과 마음의 긴장을 푸는 것이 도움돼요.
          <br />
        </TextArea>
      </Card5Summary>
      <Footer onPrev={onPrev} />
    </>
  );
}
