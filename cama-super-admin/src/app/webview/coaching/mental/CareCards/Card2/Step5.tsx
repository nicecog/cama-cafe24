import Footer from "../../component/Footer";
import { prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import ProgramButtons from "./component/programButtons";
export default function Step5() {
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5  tracking-tighter">
        이러한 스트레스에는 앞에서 배운 마음근육훈련도 도움이 돼요. <br />
        함께 살펴볼까요?
      </TextArea>

      <ProgramButtons type="all" />

      <Footer onPrev={onPrev} />
    </>
  );
}
