import ImageBox from "../../../component/ImageBox";
import TextBox from "../../../component/Layout/TextBox";
import Type1 from "@/assets/images/character/type1.png";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import ImporText from "../../component/ImportText";
export default function Step2() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <ImageBox
        imgSrc={Type1}
        className="w-[110px] mt-5"
        containerClassName="!mb-5"
      />
      <TextBox className="text-justify tracking-tighter ">
        앞선 보기에 많이 해당할수록 상대방과 소통하면서 자신의{" "}
        <ImporText className="!mx-0">욕구나 감정</ImporText>이 충족되지 못할
        가능성이 커요.
      </TextBox>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
