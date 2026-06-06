import ImageBox from "../../../component/ImageBox";
import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import Card4Image from "@/assets/images/mental/59.png";
import infoImage from "@/assets/images/character/infoTitle.png";

import MissionTitle from "../../../component/Layout/MissionTitle";
import ImporText from "../../component/ImportText";
import TextArea from "../../../component/Layout/TextArea";
// 생각 바꾸기
export default function Step3() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <MissionTitle className="mt-5 mb-10 flex gap-3 items-center justify-center">
        <img src={infoImage} className="w-[28px]" />
        생각이 균형을 잃는다고요?
      </MissionTitle>
      <TextBox className="mt-3 text-center">
        <ImageBox
          imgSrc={Card4Image}
          className="w-[200px]"
          containerClassName="!mb-5"
        />
        건강하고 균형잡힌 생각은 <br />
        <ImporText className="!mx-0">'유연하고 합리적'</ImporText>
        이에요.
      </TextBox>
      <TextArea className="mt-5 text-justify">
        <ImporText className="mr-1">'경직되고 비합리적'</ImporText>인 생각으로
        치우쳐 있으면 마음의 균형도 깨져요.
      </TextArea>
      <TextArea className="mt-3 text-justify">
        긍정적인 마음가짐을 위해서는 생각의 균형을 바로잡아야 해요.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
