import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
import Bubble from "../../component/Bubble";

export default function Step3() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Bubble>
        1. 긍정정서
        <br />
        (Positive emotion)
      </Bubble>
      <TextArea className="mt-5  text-justify">
        <p className="tracking-tighter font-bold mb-5">
          일상에서 좋은느낌이 든 때는 언제인가요?
        </p>
        행복을 위한 첫 번째 기술은 긍정적인 정서를 자주 경험하는 거에요.
        <br />
      </TextArea>
      <TextArea className="mt-5 text-justify">
        <ImporText className="!ml-0 !mr-1">
          기쁘다, 편안하다, 감사하다, 충분하다, 평온하다, 뿌듯하다, 희망적이다,
          자신 있다, 행복하다
        </ImporText>
        와 같은 정서를 만끽하세요.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
