import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TypeImage from "@/assets/images/mental/62.png";
import ImageBox from "../../../component/ImageBox";
import TextArea from "../../../component/Layout/TextArea";
import { prevStepAtom } from "../../session_6/session6Atom";

export default function Step1() {
  // 이때만 7회기꺼
  const onPrev = useSetAtom(prevStepAtom);

  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <TextBox className="mt-5">
        <ImageBox imgSrc={TypeImage} className="w-[220px]" />

        <div className="text-center">
          <p className="font-oneMobile mt-1 text-camaColor1">
            "마음대로 먹을 수 없는 게 <br />
            너무 큰 스트레스에요."
          </p>
          <p className="font-oneMobile mt-1 text-camaColor1">
            "냄새가 날까봐 걱정돼서 <br />늘 조마조마해요."
          </p>
          <p className="font-oneMobile mt-1 text-camaColor1">
            "처리가 어려워 외출을 못 하겠어요."
          </p>
          <p className="font-oneMobile mt-1 text-camaColor1">
            "배우자에게 눈치가 보여요."
          </p>
        </div>
      </TextBox>
      <TextArea className="mt-5 text-justify">
        혼자서 마음 고생이 많으셨지요? <br />
        장루는 처음에는 관리하는 것도 서툴고, 조절도 잘 안되고 먹는 것에 제약이
        생기기도 하는 등 여러가지 스트레스를 동반하는 일이에요.
      </TextArea>
      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
