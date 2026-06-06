import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import Bubble from "../../component/Bubble";
import ImporText from "../../component/ImportText";

export default function Step4() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Bubble>
        2. 몰입
        <br />
        (Engagement)
      </Bubble>
      <TextArea className="mt-5  text-justify">
        <p className="tracking-tighter font-bold mb-5">
          시간이 가는 줄 모르게 몰입해 본 경험이 있으신가요?
        </p>
        <p className="tracking-tighter mb-1">
          <ImporText className="!mx-0">깊은 몰입</ImporText>의 경험은 큰
          만족감을 느끼게해요.
        </p>
        일과 관련된 것이 아니어도 여가 생활, 관계에서도 마찬가지이지요.
        <br />
      </TextArea>
      <TextArea className="mt-5 text-justify">
        몰입했던 기억을 회상하며 충분히 즐기고 누리는 것 또한 나를 행복해지게
        만든답니다.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
