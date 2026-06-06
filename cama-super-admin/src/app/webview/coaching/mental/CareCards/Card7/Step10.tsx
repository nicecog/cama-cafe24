import Footer from "../../component/Footer";
import { nextStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
import Card5Summary from "../../CardSummary/Card5";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  // const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Card5Summary onComplete={() => onNext()}>
        <TextArea className="mt-5  text-justify ">
          도움이 되는 다른 방법도 알려드릴게요.
        </TextArea>
        <TextArea className="text-justify ">
          마음근육훈련 <ImporText className="!mx-0">[명상]</ImporText>과{" "}
          <ImporText className="!mx-0">[호흡]</ImporText>이에요.
        </TextArea>
        <TextArea className="text-justify  mb-10">
          <p className="tracking-tighter">
            카마 코치와 함께 재발 불안을 잘 다뤄봐요.
          </p>
          함께 해 볼까요?
        </TextArea>
      </Card5Summary>
      <Footer />
    </>
  );
}
