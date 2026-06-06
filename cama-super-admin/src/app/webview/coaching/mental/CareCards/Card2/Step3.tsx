import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import Advice from "@/assets/images/character/advice1.png";
import ImageBox from "../../../component/ImageBox";
export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextBox className="mt-5  ">
        <ImageBox
          imgSrc={Advice}
          className="w-[110px] mt-5"
          containerClassName="!mb-5"
        />
        우선, 장루를 잘 다룰 수 있는 방법을 알아야해요.
        <br />
      </TextBox>

      <TextArea className="mt-5 text-justify">
        특히 수술 초기에는 장루 관리에 대해 적절히 교육을 받는 것이 중요해요.
        또한, 식이조절도 도움이 돼요.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        문제가 있을 때 적극적으로 대처하는 건 정말 좋은 방법이랍니다.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
