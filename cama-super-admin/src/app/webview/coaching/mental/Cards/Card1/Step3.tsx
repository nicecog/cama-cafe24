import ImageBox from "../../../component/ImageBox";
import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";
import Advice from "@/assets/images/character/advice1.png";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
export default function Step3() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <ImageBox
        imgSrc={Advice}
        className="w-[110px] mt-5"
        containerClassName="!mb-5"
      />
      <TextBox className="text-justify tracking-tighter">
        마음은 몸의 반응, 즉 신체의 감각과도 아주 긴밀하게 연결되어 있어요.
      </TextBox>
      <TextArea className="mt-5 text-justify">
        불안할 때 심장이 두근거리고 식은땀이 나고 호흡이 가빠지는 것처럼요.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        암에 맞서 나를 지키기 위해, 몸은 신경을 바짝 곤두세우게 된답니다.
        근육에는 힘이 들어가고요.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        그러나 늘 이런 상태로 지낸다면 마치 브레이크가 고장난 자동차처럼 엔진이
        과열되어 버릴거에요.
      </TextArea>
      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
