import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";

export default function Step2() {
  const onPrev = useSetAtom(prevStepAtom);
  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <TextArea className="mt-5  tracking-tighter">
        그럴 땐, 마음근육훈련에서 함께 살펴본
        <ImporText> "나 말하기 기법"</ImporText>으로 배우자 또는 연인과
        대화해보는 것도 도움이 돼요.
      </TextArea>

      <TextArea className="mt-5">
        친밀한 관계는 더욱 돈독해지고 자신감도 회복하고, 암에 대해서도 더 잘
        대처할 수 있을 거에요.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
