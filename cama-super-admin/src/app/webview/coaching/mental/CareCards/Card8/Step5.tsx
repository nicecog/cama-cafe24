import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import Bubble from "../../component/Bubble";
import ImporText from "../../component/ImportText";
import Card2Summary from "../../CardSummary/Card2";
import MentalButton from "../../component/MentalButton";
import { useEffect, useState } from "react";
import MissionTitle from "../../../component/Layout/MissionTitle";

export default function Step5() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [visible]);

  return (
    <>
      {!visible ? (
        <>
          <Bubble>
            3. 관계
            <br />
            (Relationship)
          </Bubble>
          <TextArea className="mt-5 mb-5 text-justify">
            <p className="font-bold mb-5">
              내 곁의 소중한 사람들을 생각하면 누가 떠오르나요?
            </p>
            <p className="tracking-tighter mb-1">
              <ImporText className="!mx-0">긍정적인 관계</ImporText>는 우울이나
              불안을 낮춰줘요. <br />
              자주 만나거나 많은 사람을 만나지 않더라도, 끈끈하고 안정적인
              관계는 행복을 높여주는 중요한 요인이 되지요.
            </p>
            긍정적인 의사소통 방식을 사용하는 것도 도움이 돼요.
          </TextArea>
          <MissionTitle>함께 살펴볼까요?</MissionTitle>
          <MentalButton onClick={() => setVisible(true)}>
            나 말하기 기법
          </MentalButton>
        </>
      ) : (
        <Card2Summary onComplete={onNext} />
      )}

      <Footer onPrev={onPrev} />
    </>
  );
}
