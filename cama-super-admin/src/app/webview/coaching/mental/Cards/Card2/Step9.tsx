import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { prevStepAtom } from "../CardAtom";
import TextArea from "../../../component/Layout/TextArea";
import { FcInfo } from "react-icons/fc";
import MentalButton from "../../component/MentalButton";
import { AnswersType } from "../CardTypes";
export default function Step9(props: {
  onSave: (data: AnswersType[]) => void;
}) {
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextBox className="mt-5 text-justify">
        오늘부터 일상에서 연습해 보세요.
        <br />
        특히 다음과 같은 상황은 훈련하기에 아주 좋은 순간이에요!
      </TextBox>

      <TextArea className="mt-5">
        <p className="tracking-tighter font-oneMobile text-camaColor1 flex items-center justify-start gap-0.5">
          <FcInfo /> 마음이 불편하지만 꾹 참고 넘어가려고 할 때
        </p>
        <p className="tracking-tighter font-oneMobile text-camaColor1 flex items-center justify-start gap-0.5">
          <FcInfo />
          자꾸 상대방을 비난하게 될 때
        </p>
        <p className="tracking-tighter font-oneMobile text-camaColor1 flex items-center justify-start gap-0.5">
          <FcInfo /> 거절하기 어렵다고 느낄 때
        </p>
      </TextArea>

      <TextArea className="mt-5 text-justify">
        지금까지 말하기 어려웠던 이유가 분명 있을 거에요.
        <br />
        괜찮아요. 지금부터 연습하면 편안하고 홀가분한 순간이 많아질 거에요.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        언제나 당신 편인 카마코치가 함께할게요!
      </TextArea>
      <MentalButton onClick={() => props.onSave([])}>완료 </MentalButton>
      <Footer onPrev={onPrev} />
    </>
  );
}
