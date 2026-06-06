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
      <TextArea className="mt-5  tracking-tighter">
        암 관련 피로는 원인이 매우 다양하기 때문에 먼저 피로의 원인을 알고, 그에
        맞게 관리하는 것이 필요해요.
        <br />
        암환자가 흔히겪는 증상 중 하나입니다.
      </TextArea>
      <Wait type="advice1" className="mt-3" />
      <TextBox className="mt-5 text-justify">
        많이 피로하다고 암이 재발하는 건 <br />
        아니니 너무 걱정하지 마세요.
      </TextBox>
      <TextArea className="mt-5 text-justify">
        피로는 관리해야 할 증상 중 하나에요. <br />
        도움이 되는 꿀팁을 알려드릴게요.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
