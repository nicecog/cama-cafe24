import ImageBox from "../../../component/ImageBox";
import TextBox from "../../../component/Layout/TextBox";
import Type1 from "@/assets/images/character/type1.png";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import TextArea from "../../../component/Layout/TextArea";
// 생각 바꾸기
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
        앞선 보기에 많이 해당할수록 현재 상황에 대한 불만족이 크고 자신을
        부정적으로 평가하고 있다는 뜻이에요.
      </TextBox>
      <TextArea className="mt-5 text-justify tracking-tighter">
        생각이 균형을 잃어버린 상태일 가능성이 크지요.
      </TextArea>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
