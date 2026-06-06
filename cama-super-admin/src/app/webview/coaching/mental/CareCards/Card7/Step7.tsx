import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";
import ImageBox from "../../../component/ImageBox";

import Images from "@/assets/images/mental/63.png";
export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextBox className="mt-5  tracking-tighter">
        <ImageBox imgSrc={Images} className="w-[250px]" />한 번에 다 기억하기
        어려울 수 있어요. 그래도 복습하며 여기까지 온 스스로를 격려 해주세요.
      </TextBox>
      <TextArea className="mt-5 text-center font-bold">
        포기하지 않고 시도하는 모습이 멋져요!
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
