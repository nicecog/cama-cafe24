import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import Advice from "@/assets/images/character/advice1.png";
import TextBox from "../../../component/Layout/TextBox";
import ImageBox from "../../../component/ImageBox";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextBox className="mt-5  text-justify">
        <ImageBox
          imgSrc={Advice}
          className="w-[110px] mt-5"
          containerClassName="!mb-5"
        />
        냄새에 대한 걱정은 많은 분들의 <br />
        고민이에요.
        <br />
      </TextBox>

      <TextArea className="mt-5 text-justify">
        기본적으로는 냄새가 나지 않도록 하는 기능이 있지만, 주머니를 청결하게
        관리하고 식이 조절을 한다면 배출물을 효과적으로 관리할 수 있을 거에요
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
