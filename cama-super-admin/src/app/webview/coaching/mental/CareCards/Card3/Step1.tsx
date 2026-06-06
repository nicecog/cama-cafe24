import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import { prevStepAtom } from "../../session_6/session6Atom";

export default function Step1() {
  const onPrev = useSetAtom(prevStepAtom);

  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <TextArea className="mt-5">
        유방암을 겪는 환자분들이 흔하게 호소하는 어려움은 다음과 같아요.
      </TextArea>
      <TextBox className="mt-5 text-justify5">
        유방암을 치료하는 과정에서 몸의 모습이 이전과 달라져 위축되거나 자신감이
        낮아질 수 있어요.
        <br />
        <br />
        또한, 미처 발견하지 못한 질병이 있을까봐 걱정하거나 재발에 대한 불안으로
        사소한 신체 증상에도 긴장하게 될 수 있고, 사회적 관계가 좁아질 수도
        있어요.
      </TextBox>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
