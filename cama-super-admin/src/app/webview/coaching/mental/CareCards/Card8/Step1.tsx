import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import { prevStepAtom } from "../../session_6/session6Atom";
import MissionTitle from "../../../component/Layout/MissionTitle";
import ImporText from "../../component/ImportText";
import ImageBox from "../../../component/ImageBox";

import Images from "@/assets/images/mental/65.png";
export default function Step1() {
  const onPrev = useSetAtom(prevStepAtom);

  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <MissionTitle className="mt-5">[행복의 기술, 팔마(PERMA)]</MissionTitle>
      <TextBox className="mt-5 text-justify5">
        <MissionTitle>'다시 행복할 수 있을까?'</MissionTitle>
        <ImageBox imgSrc={Images} />
        그럼요, 암과 함께하는 동안에도 여전히 <ImporText>행복</ImporText>할 수
        있습니다.
        <br />
        카마 코치가 행복의 기술을 알려드릴게요.
      </TextBox>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
