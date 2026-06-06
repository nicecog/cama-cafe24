import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import { FcIdea } from "react-icons/fc";
import Bubble from "../../component/Bubble";
import TextBox from "../../../component/Layout/TextBox";
import TextArea from "../../../component/Layout/TextArea";

export default function Step5() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Bubble className="mt-5">예시를 살펴볼까요 ?</Bubble>

      <TextBox className="mt-10 text-justify">
        <p className="  text-camaColor border-b pb-3 text-f8 my-3 flex items-center justify-start gap-1.5 font-oneMobile">
          <FcIdea className="text-f10" /> 상황
        </p>
        원하지 않는 음식을 몸에 좋다며 자꾸 권하는 가족
      </TextBox>
      <TextArea className="mt-3">
        <span className="font-oneMobile text-camaColor1 ">
          "나 말하기 기법"
        </span>
        을 사용한다면, 어떻게 말할 수 있을까요?
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
