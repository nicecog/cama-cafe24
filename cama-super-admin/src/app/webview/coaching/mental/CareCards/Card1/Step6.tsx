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
      <TextArea className="mt-5  tracking-tighter">
        <MissionTitle className="mb-2 !text-left">
          필요하다면 도움을 받기도 하세요.
        </MissionTitle>
        <p>혼자서 다 할 수 없어요. </p>
        <p>도움을 받으면 나중에 나도 도움을 줄 수 있어요.</p>
      </TextArea>

      <TextArea className="mt-10 text-justify">
        <MissionTitle className="mb-2 !text-left">
          하지 않아도 되는 일은 내버려두는 <br />
          것도 필요해요.
        </MissionTitle>
        하지 않는 것도 선택이에요.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
