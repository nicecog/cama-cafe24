import Footer from "../../component/Footer";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
import Bubble from "../../component/Bubble";
import TextBox from "../../../component/Layout/TextBox";
import MentalButton from "../../component/MentalButton";

export default function Step11(props: { onSave: () => void }) {
  return (
    <>
      <Bubble className="mt-5 mb-5" type={"type3"}>
        <p className="mb-1.5">카마 코치의 요약</p>
      </Bubble>

      <TextBox className="mt-5 text-justify">
        암 재발에 대한 두려움과 걱정을{" "}
        <ImporText className="!mx-0">'암 재발 불안'</ImporText>
        이라고 해요.
        <br />암 재발 불안을 다스리는 데 도움이 되는 방법이 있어요.
      </TextBox>
      <TextArea className="mt-5 text-justify">
        <p className="font-oneMobile">1. 재발 불안 이해하기</p>
        <p className="font-oneMobile">2. 생각 바꾸기</p>
        <p className="font-oneMobile">
          3. 명상 또는 이완훈련으로 안정감 느끼기
        </p>
      </TextArea>
      <TextArea className="mt-5 text-justify">
        마음 근육훈련을 활용해 불안을 줄이고 <br />
        하루하루를 <ImporText>의미있게 살아가길</ImporText> 바랄게요.
      </TextArea>

      <MentalButton onClick={props.onSave}>완료</MentalButton>
      <Footer />
    </>
  );
}
