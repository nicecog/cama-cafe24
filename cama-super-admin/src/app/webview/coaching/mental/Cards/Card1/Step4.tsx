import ImageBox from "../../../component/ImageBox";
import TextBox from "../../../component/Layout/TextBox";
import Card1Image from "@/assets/images/mental/56.png";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import MissionTitle from "../../../component/Layout/MissionTitle";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
// 나 말하기 기법
export default function Step4() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="text-justify mt-5">
        이때 브레이크 역할을 해주는 게
        <span className="font-oneMobile text-camaColor1 mx-1">복식호흡</span>
        훈련이에요. 몸의 긴장을 풀고 평온함을 찾도록 도와주지요.
      </TextArea>
      <TextBox className="mt-5 text-center">
        <MissionTitle>
          놀랍도록 몸과 마음이 <br />
          편안해지는 마법!
        </MissionTitle>
        <ImageBox imgSrc={Card1Image} className="mt-5" />
        <ImporText className="!mx-0">복식호흡</ImporText>을 꾸준히 연습해
        보아요.
      </TextBox>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
