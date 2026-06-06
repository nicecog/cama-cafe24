import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import TextBox from "../../../component/Layout/TextBox";
import Bubble from "../../component/Bubble";
import ImporText from "../../component/ImportText";
import TextArea from "../../../component/Layout/TextArea";
import { useEffect } from "react";
// 생각 바꾸기
export default function Step19() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Bubble className="mt-5" type={"type3"}>
        <p className="mb-1.5">카마코치의 요약</p>
      </Bubble>
      <TextBox className="mt-5 text-center">
        <ImporText>"균형잡힌 생각"</ImporText>
        <br />은 유연하고 합리적 이에요.
      </TextBox>
      <TextArea className="mt-5 text-justify">
        생각 속에 숨어 있는 오류를 찾아 바꾸면 기분이 훨씬 나아질 수 있어요.
      </TextArea>

      <TextArea className="mt-5 text-justify">
        생각은 고집이 세서 한 번에 바뀌지 않을 수 있지만, 그래도 괜찮아요. 계속
        하다보면 어느새 생각의 균형을 잡는 데 선수가 돼 있을거에요.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        그때까지 카마코치가 함께할게요!
      </TextArea>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
