import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";

import MissionTitle from "../../../component/Layout/MissionTitle";
import infoImage from "@/assets/images/character/infoTitle.png";
import TextBox from "../../../component/Layout/TextBox";
import ImporText from "../../component/ImportText";
// 생각 바꾸기
export default function Step4() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <MissionTitle className="mt-5 mb-10 flex gap-3 items-center justify-center">
        <img src={infoImage} className="w-[28px]" />
        생각을 바꾸는 게 어떤 <br />
        도움이 되나요?
      </MissionTitle>

      <TextBox className="mt-5 text-justify">
        인간의 감정, 생각, 행동은 톱니바퀴처럼 긴밀하게 연결되어 있어요. 그래서
        하나가 바뀌면 나머지도 영향을 받게 되지요.
        <br /> 즉, <ImporText>생각을 바꾸면</ImporText> 기분이 나아지고 기분이
        좋아지면 행동에도 자신감이 생기는 거에요.
      </TextBox>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
