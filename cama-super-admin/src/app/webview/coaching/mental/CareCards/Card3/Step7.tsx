import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5 text-justify text-camaColor1">
        <p className="font-oneMobile my-1">
          1. 불편했던 상황을 모두 적어보세요.
        </p>
        <p className="font-oneMobile my-1">
          2. 불편한 정도에 따라 각각의 순위를 매겨보세요.
        </p>
        <p className="font-oneMobile my-1">
          3. 순위가 가장 낮은 것부터 직접 해 보세요.
        </p>
        <p className="font-oneMobile my-1">
          4. 하나가 편안해지면 그 다음 순위의 것으로 넘어가요.
        </p>
        <p className="font-oneMobile my-1">5. 반복해서 훈련합니다.</p>
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
