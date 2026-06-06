import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import ImporText from "../../component/ImportText";
import Bubble from "../../component/Bubble";
import { FcIdea } from "react-icons/fc";
import MessageExample from "./component/MessageExample";

export default function Step7() {
  const onPrev = useSetAtom(prevStepAtom);
  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <Bubble className="mt-5">
        <p className="mb-1.5">어떠신가요 ?</p>또 다른 예시를 살펴볼까요 ?
      </Bubble>

      <TextBox className="mt-5 text-justify">
        <p className="  text-camaColor border-b pb-3 text-f8 my-3 flex items-center justify-start gap-1.5 font-oneMobile">
          <FcIdea className="text-f10" /> 상황
        </p>
        치료 방법에 대해 고민하며 배우자에게 걱정을 털어놓자 핸드폰을 쳐다보며
        <ImporText>'걱정마'</ImporText>
        라고 이야기한다.
      </TextBox>

      <MessageExample type={1} className="mt-5">
        "핸드폰을 쳐다보며 걱정하지 말라고 말했다."
      </MessageExample>
      <MessageExample type={2} className="mt-5">
        "함께 의논하고 싶었는데 서운해."
      </MessageExample>
      <MessageExample type={3} className="mt-5">
        "나는 혼자 결정하는 것이 두려우니까 의사결정을 도와주면 좋겠어."
      </MessageExample>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
