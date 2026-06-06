import ImageBox from "../../../component/ImageBox";
import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";
import Advice from "@/assets/images/character/advice1.png";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import ImporText from "../../component/ImportText";
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
      <TextBox className="text-justify  ">
        화내거나 싸우지 않고, 일방적으로 참거나 양보하지 않더라도 내 욕구를
        충분히 채울 수 있어요.
      </TextBox>
      <TextArea className="mt-5 text-justify">
        마음건강에 도움이 되는 소통의 비법,{"   "}
        <ImporText className="!mx-0">'나 말하기 기법'</ImporText>을 소개할게요.
      </TextArea>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
