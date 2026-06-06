import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5  tracking-tighter text-justify">
        <MissionTitle className="mb-2 !text-left">
          차근차근 한발 한발
        </MissionTitle>
        달라진 내 모습 때문에 하지 못하는 것이 늘어나고, 가지 못하는 곳이
        많아졌나요? <br /> 괜찮아요, 다시 하나씩 천천히 연습하면 돼요. <br />할
        수 있는만큼 한발 한발 내딛다보면, 예전처럼 편안하게 활동할 수
        있을거에요.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
