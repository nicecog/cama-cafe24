import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";
import ImporText from "../../component/ImportText";
export default function Step2() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5  text-justify">
        암 치료 중에는 여러 가지 부작용이 나타나거나 피로감, 통증 등을 느낄 수
        있어요. <br />
        기분이 가라앉고 삶에 즐거움도 없는 것 같고, 희망을 찾을 수 없기도
        하지요.
      </TextArea>
      <TextBox className="mt-5  text-justify">
        <ImporText> 팔마[PERMA]</ImporText>는 긍정적인 태도와 행동으로 삶의 질을
        높이고, 재발 불안을 줄이며 희망을 높이는
        <span className="font-bold underline ml-1">5가지</span> 기술이에요.
      </TextBox>
      <TextArea className="tracking-tighter text-center font-bold mt-5 mb-2">
        5가지 기술의 앞 글자를 따서
        <br /> 팔마라고 해요!
      </TextArea>
      <TextBox className="text-justify  ">
        <p>
          <ImporText className="mr-0">P</ImporText>ositive emotion
          <span className="font-oneMobile ml-1.5">(긍정 정서)</span>
        </p>
        <p>
          <ImporText className="mr-0">E</ImporText>ngagement
          <span className="font-oneMobile ml-1.5">(몰입)</span>
        </p>
        <p>
          <ImporText className="mr-0">R</ImporText>elationship
          <span className="font-oneMobile ml-1.5">(관계)</span>
        </p>
        <p>
          <ImporText className="mr-0">M</ImporText>eaning
          <span className="font-oneMobile ml-1.5">(의미)</span>
        </p>
        <p>
          <ImporText className="mr-0">A</ImporText>ccomplishment
          <span className="font-oneMobile ml-1.5">(성취)</span>
        </p>
      </TextBox>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
