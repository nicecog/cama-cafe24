import ImageBox from "../../../component/ImageBox";
import TextBox from "../../../component/Layout/TextBox";
import Card1Image from "@/assets/images/mental/57.png";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";

import infoImage from "@/assets/images/character/infoTitle.png";
import MissionTitle from "../../../component/Layout/MissionTitle";
// 나 말하기 기법
export default function Step4() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <MissionTitle className="mt-5 mb-10 flex gap-3 items-center justify-center">
        <img src={infoImage} className="w-[28px]" />나 말하기 기법(I-message)
      </MissionTitle>
      <ImageBox imgSrc={Card1Image} containerClassName="!mb-3" />
      <TextBox className="mt-3 text-left">
        <p className="font-oneMobile my-0.5">
          1. 상대방의 <span className="text-camaColor1">행동</span>에 대해서
          이야기한다.
        </p>
        <p className="font-oneMobile my-0.5">
          2. 그로 인한 나의 <span className="text-camaColor1">감정</span>을
          이야기한다.
        </p>
        <p className="font-oneMobile my-0.5">
          3. <span className="text-camaColor1">바라는 것</span>을 구체적으로
          이야기한다.
        </p>
      </TextBox>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
