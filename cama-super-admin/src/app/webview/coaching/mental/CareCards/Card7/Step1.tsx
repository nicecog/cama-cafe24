import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import { prevStepAtom } from "../../session_6/session6Atom";
import MissionTitle from "../../../component/Layout/MissionTitle";
import ImporText from "../../component/ImportText";
import ImageBox from "../../../component/ImageBox";

import Images from "@/assets/images/mental/64.png";
export default function Step1() {
  const onPrev = useSetAtom(prevStepAtom);

  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <TextBox className="mt-5 text-justify5">
        <MissionTitle>'암이 재발하면 어떡하지?'</MissionTitle>
        <ImageBox imgSrc={Images} className="w-[220px]" />암 환자라면 누구나
        갖고 있을 이러한 불안과 두려움을
        <ImporText>'암 재발 불안'</ImporText>이라고 합니다. 따로 이름을 붙일만큼
        흔하고 중요한 것 중 하나이지요.
      </TextBox>
      <TextArea className="mt-5 text-justify">
        암이라는 병의 특성 상 실제로 재발할 확률도 있기 때문에 그저 뜬구름 잡는
        걱정이 아니기도 해요.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
