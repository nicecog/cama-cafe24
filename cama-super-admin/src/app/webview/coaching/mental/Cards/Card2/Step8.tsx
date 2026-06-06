import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import ImporText from "../../component/ImportText";
import Bubble from "../../component/Bubble";
import MissionTitle from "../../../component/Layout/MissionTitle";

import infoImage from "@/assets/images/character/infoTitle.png";
import { useEffect } from "react";
export default function Step7() {
  const onPrev = useSetAtom(prevStepAtom);
  const onNext = useSetAtom(nextStepAtom);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Bubble className="mt-5" type={"type3"}>
        <p className="mb-1.5">카마 코치의 요약</p>
      </Bubble>
      <TextBox className="mt-5 tracking-tighter px-2 text-justify">
        <ImporText className="!ml-0">'나 말하기 기법'</ImporText>으로 건강하게
        소통해보세요. 스트레스는 줄고 소중한 관계는 깊어질 거에요.
      </TextBox>

      <TextBox className="mt-3 text-left">
        <MissionTitle className="mb-5 flex gap-3 items-center justify-start">
          <img src={infoImage} className="w-[28px]" />
          "나 말하기"
        </MissionTitle>
        <p className="font-oneMobile my-0.5">
          1. 상대방의 <span className="text-camaColor1">행동</span>에 대해서
          이야기해요.
        </p>
        <p className="font-oneMobile my-0.5">
          2. 그로 인한 나의 <span className="text-camaColor1">감정</span>을
          말하고,
        </p>
        <p className="font-oneMobile my-0.5">
          3. <span className="text-camaColor1">바라는 것</span>을 구체적으로
          알리는거에요.
        </p>
      </TextBox>
      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
