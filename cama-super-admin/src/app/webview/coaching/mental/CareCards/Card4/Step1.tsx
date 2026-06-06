import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import { prevStepAtom } from "../../session_6/session6Atom";
import ImporText from "../../component/ImportText";
import Images from "@/assets/images/mental/50.png";
import ImageBox from "../../../component/ImageBox";
export default function Step1() {
  const onPrev = useSetAtom(prevStepAtom);

  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <TextArea className="mt-5 text-justify tracking-tighter">
        유방암의 수술 치료는 몸의 모양을 변형시키고 조기 폐경의 위험을 높이는 등{" "}
        <ImporText>'여성'</ImporText>으로서의 고민을 더하게 돼요.
      </TextArea>
      <TextBox className="mt-5 text-justify tracking-tighter">
        <ImageBox imgSrc={Images} />
        배우자 또는 연인 관계에서도 성적 매력이 줄어든다고 느끼거나 위축되고
        우울한 마음이 들 수 있어요. <br />
        그로 인해 관계가 더욱 어려워질 수 있지요. 쑥스럽거나 상처받을까 봐
        걱정돼 솔직하게 터 놓지 못할 수도 있지요.
      </TextBox>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
