import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom, stepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";
import ImporText from "../../component/ImportText";
import useAlert from "@/hooks/useAlert";
import ChoiceButton from "../../../component/ChoiceButton";
import { useState } from "react";
import Card4Summary from "../../CardSummary/Card4";
export default function Step6() {
  const setStep = useSetAtom(stepAtom);
  const onPrev = useSetAtom(prevStepAtom);
  const onNext = useSetAtom(nextStepAtom);

  const { alert } = useAlert();

  const [visible, setVisible] = useState(false);

  const onClick = (check: string) => {
    if (check === "Y") {
      alert("좋아요, 함께 해보아요", () => {
        setStep(8);
      });
      return;
    }
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
  };

  return (
    <>
      {!visible ? (
        <>
          <TextArea className="mt-5  tracking-tighter">
            <MissionTitle className="mb-2 !text-left">
              1. 생각바꾸기로 유연하게 사고하기
            </MissionTitle>
            마음근육훈련에서 했던 <ImporText>생각바꾸기</ImporText>를
            기억하시나요?
          </TextArea>
          <ChoiceButton
            onClick={onClick}
            cancelText={
              <>
                아니오 <br /> 복습이 필요해요
              </>
            }
          ></ChoiceButton>
        </>
      ) : (
        <>
          <Card4Summary onComplete={onNext} />
        </>
      )}
      <Footer onPrev={onPrev} />
    </>
  );
}
