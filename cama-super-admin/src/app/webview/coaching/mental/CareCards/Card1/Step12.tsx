import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import Bubble from "../../component/Bubble";
import { FcInfo } from "react-icons/fc";
import MentalButton from "../../component/MentalButton";

export default function Step12(props: { onSave: () => void }) {
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Bubble className="mt-5" type={"type3"}>
        <p className="mb-1.5">카마 코치의 요약</p>
      </Bubble>
      <TextBox className="mt-5 tracking-tighter text-justify">
        일상적인 피로감과 달리, 의지와 상관없이 암과 관련된 피로를 느낄 수
        있어요. <br />
        그럴 땐 이런 방법이 도움돼요.
      </TextBox>

      <TextArea className="mt-5">
        <p className="tracking-tighter font-oneMobile text-camaColor1 flex items-center justify-start gap-1">
          <FcInfo /> 1. 에너지를 효율적으로 쓰기
        </p>
        <p className="ml-5 mb-3">꼭 필요한 일을 우선순위에 따라 하기</p>
        <p className="tracking-tighter font-oneMobile text-camaColor1 flex items-center justify-start gap-1">
          <FcInfo />
          2. 규칙적으로 생활 하기
        </p>
        <p className="ml-5 mb-3">규칙적인 식사와 운동, 수면 챙기기</p>
        <p className="tracking-tighter font-oneMobile text-camaColor1 flex items-center justify-start gap-1">
          <FcInfo /> 3. 긴장 풀기
        </p>
        <p className="ml-5 mb-3">
          이완훈련과 명상으로 몸과 마음을 편안하게 하기
        </p>
      </TextArea>
      <MentalButton onClick={props.onSave}>완료</MentalButton>

      <Footer onPrev={onPrev} />
    </>
  );
}
