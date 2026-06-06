import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5 text-justify">
        또한 규칙적으로 생활하는 것이 좋아요. <br />
        잠을 자는 시간 뿐만 아니라, 운동과 식사도 되도록 일정하게 해 보세요.
      </TextArea>
      <TextArea className="mt-3 text-justify">
        몸과 마음의 균형이 바로 잡히고 에너지 관리에도 도움이 될거에요.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
