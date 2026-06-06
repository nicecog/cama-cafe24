import Footer from "../../component/Footer";
import { prevStepAtom, stepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
import Wait from "../Component/Wait";
import useAlert from "@/hooks/useAlert";
import ChoiceButton from "../../../component/ChoiceButton";
import { useState } from "react";
import Card4Summary from "../../CardSummary/Card4";
export default function Step5() {
  const onPrev = useSetAtom(prevStepAtom);

  const setStep = useSetAtom(stepAtom);

  const { alert } = useAlert();

  const [isSummary, setIsSummary] = useState(false);

  const onClick = (check: string) => {
    if (check === "Y") {
      alert("훌륭하시네요.", () => {
        setStep(8);
      });
    } else {
      alert("괜찮아요. 카마코치와 복습해볼게요.", () => {
        setIsSummary(true);
      });
    }
  };

  return (
    <>
      {!isSummary ? (
        <>
          <Wait />
          <TextArea className="mt-5 ">
            마음근육훈련의
            <ImporText>'생각바꾸기'</ImporText>를 활용해 <br />
            보아요.
            <br />
            생각바꾸기는 재발 불안을 다스리는데 <br />
            정말 효과적이에요.
          </TextArea>
          <ChoiceButton onClick={onClick}>
            "생각바꾸기를 기억하시나요?"
          </ChoiceButton>
        </>
      ) : (
        <Card4Summary
          onComplete={() => {
            setStep(7);
          }}
        />
      )}

      <Footer onPrev={onPrev} />
    </>
  );
}
