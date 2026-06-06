import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
import Bubble from "../../component/Bubble";

export default function Step7() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Bubble>
        5. 성취
        <br />
        (Accomplishment)
      </Bubble>
      <TextArea className="mt-5  text-justify">
        <p className="tracking-tighter font-bold mb-5">
          나의 강점은 무엇인가요?
        </p>
        강점을 발휘해서 스스로 만족할 수 있는 것을 해 보세요. <br />
        작은 것이어도 <ImporText className="!mx-0">성취감</ImporText>을 느끼고
        성장하는 느낌이 든다면 좋아요.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
