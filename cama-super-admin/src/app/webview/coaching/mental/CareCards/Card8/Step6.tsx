import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
import Bubble from "../../component/Bubble";

export default function Step6() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Bubble>
        4. 의미
        <br />
        (Meaning)
      </Bubble>
      <TextArea className="mt-5  text-justify">
        <p className="tracking-tighter font-bold mb-5">
          나는 어떤 삶을 의미있다고 여기시나요?
        </p>
        어떤 방식으로든 스스로 생각할 때 멋지다고 생각되는, 의미 있는 삶을
        살아보는 거에요.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        <ImporText className="!ml-0 !mr-1">
          나만의 의미를 발견하고 만들어가는 과정
        </ImporText>
        에서 큰 만족감을 느낄 수 있어요.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
