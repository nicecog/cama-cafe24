import Footer from "../../component/Footer";
import { nextStepAtom, stepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import Advice from "@/assets/images/character/advice1.png";
import ImageBox from "../../../component/ImageBox";
import TextBox from "../../../component/Layout/TextBox";
export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);

  const setStep = useSetAtom(stepAtom);

  return (
    <>
      <TextBox className="mt-5 tracking-tighter">
        <ImageBox
          imgSrc={Advice}
          className="w-[110px] mt-5"
          containerClassName="!mb-5"
        />
        장루를 갖고 있는 환자들이 흔히 할 수 있는 생각들이에요.
      </TextBox>
      <TextArea className="mt-5 text-justify text-camaColor1">
        <p className="font-oneMobile">'사람들이 냄새난다고 싫어할거야.'</p>
        <p className="font-oneMobile">
          '터지면 어떡하지, 외출을 안 하는게 나아.'
        </p>
        <p className="font-oneMobile">
          '장루 때문에 성적으로 매력이 없을거야.'
        </p>
      </TextArea>
      <Footer onPrev={() => setStep(6)} onNext={onNext} />
    </>
  );
}
