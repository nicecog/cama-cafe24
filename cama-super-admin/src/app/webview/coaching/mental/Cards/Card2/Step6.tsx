import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import MessageExample from "./component/MessageExample";
import Bubble from "../../component/Bubble";
// 나 말하기 기법
export default function Step6() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Bubble type="advice1" className=" mt-5">
        나 말하기 기법 <br />
        (I-message)
      </Bubble>

      <MessageExample type={1} className="mt-5">
        "지금 먹고 싶지 않은데 자꾸 권하네."
      </MessageExample>
      <MessageExample type={2} className="mt-5">
        "미안하기도 하고 부담스럽기도 해."
      </MessageExample>
      <MessageExample type={3} className="mt-5">
        "다음에 먹고 싶다고 할 때 갖다 주면 좋겠어."
      </MessageExample>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
