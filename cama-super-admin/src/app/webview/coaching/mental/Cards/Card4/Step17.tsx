import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import TextBox from "../../../component/Layout/TextBox";
import Bubble from "../../component/Bubble";
// 생각 바꾸기
export default function Step17() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Bubble className="mt-5" type={"advice2"}>
        <p className="mb-1.5">카마코치와 한번 더</p>
        <p>연습해볼까요?</p>
      </Bubble>
      <TextBox className="mt-5 text-justify font-semibold text-black">
        검사 결과를 확인하는 데 주치의의 표정이 어두워보입니다. 나는 조바심이
        나고 긴장되기 시작합니다.
      </TextBox>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
