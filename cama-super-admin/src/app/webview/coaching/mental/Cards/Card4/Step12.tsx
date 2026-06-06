import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import TextBox from "../../../component/Layout/TextBox";
import Bubble from "../../component/Bubble";
// 생각 바꾸기
export default function Step12() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Bubble className="mt-5" type={"advice2"}>
        <p className="mb-1.5">카마 코치의 조언</p>
      </Bubble>
      <TextBox className="mt-5">
        <div className="text-justify font-oneMobile flex items-center justify-start gap-1.5">
          <p className="text-camaColor">
            1. 부정적인 것 뿐만 아니라 긍정적인 면도 함께 살펴봅니다.
          </p>
        </div>
      </TextBox>
      <TextBox className="mt-2">
        <div className="text-justify font-oneMobile flex items-center justify-start gap-1.5">
          <p className="text-camaColor">2. 다양한 가능성을 생각해 봅니다.</p>
        </div>
      </TextBox>
      <TextBox className="mt-2">
        <div className="text-justify font-oneMobile flex items-center justify-start gap-1.5">
          <p className="text-camaColor">
            3. 내 생각이 맞다는 증거를 찾아봅니다. 그리고 틀렸다는 증거도
            찾아봅니다.
          </p>
        </div>
      </TextBox>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
