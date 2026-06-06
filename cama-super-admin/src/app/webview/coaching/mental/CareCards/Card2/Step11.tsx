import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";

export default function Step11() {
  const onPrev = useSetAtom(prevStepAtom);
  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <TextBox className="mt-5  text-justify">
        <MissionTitle className="mb-5">
          무엇보다 중요한건 <br />
          포기하지 않는 마음!
        </MissionTitle>
        차근차근 하다보면 어느새 마음근육이 단단해져 있을거에요.
      </TextBox>
      <TextArea className="mt-5 text-justify">
        장루로 인해 겪게되는 불편함과 필요한 것을 표현하고 소중한 사람들과 잘
        지낼 수 있도록, 카마코치가 언제나 응원할게요!
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
