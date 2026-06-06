import { nextStepAtom, stepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";
import ImporText from "../../component/ImportText";
import Footer from "../../component/Footer";
import Card5Summary from "../../CardSummary/Card5";
export default function Step12() {
  const setStep = useSetAtom(stepAtom);

  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <Card5Summary onComplete={onNext}>
        <TextArea className="mt-5 mb-10 text-justify">
          <MissionTitle className="mb-2 !text-left">
            3. 명상, 호흡으로 이완하기
          </MissionTitle>
          <ImporText className="!mx-0 !mr-1.5">명상과 호흡</ImporText>을 통해
          몸과 마음을 편안하게 만들 수 있어요.
          <br />
          지금 바로 함께 연습해보아요.
        </TextArea>
      </Card5Summary>

      <Footer onPrev={() => setStep(5)} />
    </>
  );
}
