import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";
import TypeImage from "@/assets/images/mental/63.png";
import ImageBox from "../../../component/ImageBox";
export default function Step7() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);
  // TODO 8부터 시작
  return (
    <>
      <TextBox className="mt-5  tracking-tighter">
        <ImageBox imgSrc={TypeImage} />한 번에 다 기억하기 어려울 수 있어요.
        그래도 복습하며 여기까지 온 스스로를 격려해주세요. 포기하지 않고
        시도하는 모습이 멋져요!
      </TextBox>

      <TextArea className="mt-5 text-center  tracking-tighter">
        이제 장루에 대해 생각바꾸기를 해볼까요?
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
