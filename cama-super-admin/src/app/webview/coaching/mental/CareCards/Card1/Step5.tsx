import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import Wait from "../Component/Wait";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5 text-justify ">
        하루의 일과를 적어보고 우선순위를 매겨보세요. 그리고 중요한 일부터,
        가능한만큼 하는거에요.
      </TextArea>
      <Wait type="advice1" className="mt-3" />
      <TextBox className="mt-2 text-justify">
        혹시 너무 많은 것을 해야한다고 생각하나요? <br />
        모든걸 아주 잘 해내야만 한다고 느끼시나요?
      </TextBox>
      <TextArea className="mt-5 text-justify">
        나의 기대치가 어느 정도인지 점검하고, <br />
        현실적으로 조정하는 것도 현명한 방법이에요.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
