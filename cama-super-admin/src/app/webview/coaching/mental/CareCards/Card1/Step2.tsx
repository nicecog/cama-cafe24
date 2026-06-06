import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
import Wait from "../Component/Wait";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5  tracking-tighter">
        이런 것을
        <p className="my-0.5">
          <ImporText className="!mx-0">
            '암성 피로(Cancer-related fatigue)'
          </ImporText>
        </p>
        라고 해요.
        <br />
        암환자가 흔히겪는 증상 중 하나입니다.
      </TextArea>
      <Wait type="advice1" className="mt-3" />
      <TextBox className="mt-3 text-justify">
        암성피로는 일반적으로 느끼는 피로와는 달라요. 암성피로는 암이라는 병
        자체 또는 <ImporText>치료과정</ImporText>에서 생기기도 하고,
        <ImporText>신체적·심리적 문제</ImporText> 때문에 생길 수도 있어요.
        그렇지만 으레 피곤하려니 하며 넘어가는 경우도 많지요.
      </TextBox>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
