import Footer from "../../component/Footer";
import { nextStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextBox from "../../../component/Layout/TextBox";
import ImageBox from "../../../component/ImageBox";

import Images from "@/assets/images/mental/63.png";
export default function Step4() {
  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <TextBox className="mt-5 ">
        <ImageBox imgSrc={Images} className="w-[250px]" />한 번에 다 기억하기
        어려울 수 있어요. 그래도 복습하며 여기까지 온 스스로를 격려해주세요.
        포기하지 않고 시도하는 모습이 멋져요!
      </TextBox>

      <Footer onNext={onNext} />
    </>
  );
}
