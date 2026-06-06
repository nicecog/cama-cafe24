import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
import { FaCheck } from "react-icons/fa";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5  text-justify tracking-tighter flex gap-1.5">
        <div className="pt-1.5">
          <FaCheck />
        </div>
        무작정 상황 속에 나를 내던지는 것이 아니라, 편안할 수 있는 무언가와 함께
        해야해요.
      </TextArea>
      <TextArea className="mt-5 text-justify tracking-tighter flex gap-1.5">
        <div className="pt-1.5">
          <FaCheck />
        </div>
        처음에는 낯설고 힘들 수 있어요. <br />
        그럴 땐 믿을만한 사람과 함께 해도 좋아요.
      </TextArea>
      <TextArea className="mt-5 text-justify flex gap-1.5">
        <div className="pt-1.5">
          <FaCheck />
        </div>
        <div>
          <ImporText>복식호흡이나 명상, 생각바꾸기</ImporText> 등을 활용해서
          상황을 편안하게 느끼도록 할 수 있답니다.
        </div>
      </TextArea>
      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
