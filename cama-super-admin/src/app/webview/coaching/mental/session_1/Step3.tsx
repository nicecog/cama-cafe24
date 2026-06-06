import { useAtomValue, useSetAtom } from "jotai";
import TextBox from "../../component/Layout/TextBox";
import { nextStepCdAtom, prevStepCdAtom, questionResult } from "./session1Atom";

import TextArea from "../../component/Layout/TextArea";
import ImporText from "../component/ImportText";
import ImageBox from "../../component/ImageBox";
import Images from "@/assets/images/character/advice3.png";
import Footer from "../component/Footer";

export default function Step4() {
  // Atom
  const value = useAtomValue(questionResult);
  const onNext = useSetAtom(nextStepCdAtom);
  const onPrev = useSetAtom(prevStepCdAtom);

  return (
    <>
      <div className="px-[25px] py-5 flex justify-center flex-col gap-2">
        <TextBox className="text-center mt-5">
          <ImageBox
            imgSrc={Images}
            className="w-[95px]"
            containerClassName="!mb-3"
          />
          당신은<ImporText>{value.dispName}</ImporText>이군요!
        </TextBox>
        <TextArea className="text-justify">
          <div className="mt-2 mb-3 text-center">
            <ImporText>지피지기면 백전백승!</ImporText>
          </div>
          암에 대한 나의 대처 유형을 알면 스스로를 이해하고 의료진이나 가족과도
          효과적으로 소통할 수 있어요.
        </TextArea>
        <Footer onPrev={onPrev} onNext={onNext} />
      </div>
    </>
  );
}
