import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5  text-justify">
        우울하거나 불안하기도 하고, 몸에 대한 부정적인 이미지를 갖게 되기도
        해요. <br />
        자연스럽고 건강한 성 관계나 친밀감에도 영향을 미칠 수 있고요.
        <br /> 이런 어려움은 장루 환자들이 보편적으로 겪을 수 있는 일이에요.
      </TextArea>
      <TextBox className="mt-5 text-justify">
        생명을 유지하고, 치료 이후에 삶으로 복귀할 수도 있도록 도와주는
        <ImporText>장루</ImporText>
      </TextBox>
      <TextArea className="mt-5  text-justify">
        스트레스를 잘 관리하며 지내실 수 있도록 <ImporText>카마 코치</ImporText>
        가 도와드릴게요.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
