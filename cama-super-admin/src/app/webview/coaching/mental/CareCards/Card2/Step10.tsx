import Footer from "../../component/Footer";
import { nextStepAtom, stepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";
import ImporText from "../../component/ImportText";
import useAlert from "@/hooks/useAlert";
import ChoiceButton from "../../../component/ChoiceButton";
import { useState } from "react";
import Card2Summary from "../../CardSummary/Card2";
export default function Step10() {
  const setStep = useSetAtom(stepAtom);
  const onNext = useSetAtom(nextStepAtom);

  const { alert } = useAlert();

  const [visible, setVisible] = useState(false);

  const onClick = (check: string) => {
    if (check === "Y") {
      alert("좋아요", () => {
        setStep(11);
      });
    } else {
      alert(
        {
          html: `
              괜찮아요. <br />
              카마코치와 복습해볼게요
          `,
        },
        () => {
          setVisible(true);
        }
      );
    }
  };

  return (
    <>
      {!visible ? (
        <>
          <TextArea className="mt-5  tracking-tighter">
            <MissionTitle className="mb-2 !text-left">
              2. 마음표현하기
            </MissionTitle>
            마음근육훈련에서 배운 나 말하기 기법도 도움이 돼요.
            <br />
            <ImporText className="!mx-0 mr-1">나 말하기 기법 </ImporText>을
            기억하시나요?
          </TextArea>
          <ChoiceButton onClick={onClick} />
        </>
      ) : (
        <>
          <Card2Summary onComplete={onNext} />
        </>
      )}
      <Footer onPrev={() => setStep(5)} />
    </>
  );
}
