import Footer from "../../component/Footer";
import { prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";
import Bubble from "../../component/Bubble";
import MentalButton from "../../component/MentalButton";
import TextBox from "../../../component/Layout/TextBox";

export default function Step9(props: { onSave: () => void }) {
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Bubble className="mt-5 mb-5" type={"type3"}>
        <p className="mb-1.5">카마 코치의 요약</p>
      </Bubble>

      <TextArea className="mt-5 text-justify">
        달라진 몸의 모습 때문에 스트레스를 받을 수 있어요, 이상한 것이 아니에요.
        그럴 땐 다음의 방법이 도움돼요.
      </TextArea>
      <TextBox className="mt-5 text-justify">
        <MissionTitle className="mb-5 mt-2">1. 생각바꾸기</MissionTitle>
        나의 생각을 검토하고 적응적이고 합리적인 생각으로 바꾸어보아요.
      </TextBox>
      <TextBox className="mt-5 text-justify">
        <MissionTitle className="mb-5 mt-2">
          2. 차근차근 한발 한발 <br />
          점진적으로 경험하기
        </MissionTitle>
        피하고 싶은 불편한 상황에 순위를 매기고, 가장 낮은 단계부터 천천히 해
        보아요.
      </TextBox>
      <TextArea className="mt-5">
        하나하나 따라가다보면 어느새 이전과 같이 활기찬 나의 모습을 되찾을 수
        있을 거에요.
      </TextArea>

      <MentalButton onClick={props.onSave}>완료</MentalButton>

      <Footer onPrev={onPrev} />
    </>
  );
}
