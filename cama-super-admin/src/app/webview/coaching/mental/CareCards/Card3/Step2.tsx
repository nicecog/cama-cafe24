import Footer from "../../component/Footer";
import { prevStepAtom, stepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
import MissionTitle from "../../../component/Layout/MissionTitle";
import { motion } from "framer-motion";
import mental from "@/assets/images/character/mentalheader.png";
import mission from "@/assets/images/character/mission.png";
import useAlert from "@/hooks/useAlert";
import { useState } from "react";
import Card4Summary from "../../CardSummary/Card4";

export default function Step1() {
  const onPrev = useSetAtom(prevStepAtom);

  const setStep = useSetAtom(stepAtom);

  const { alert } = useAlert();

  const [visible, setvisible] = useState(false);

  const onClick = (check: boolean) => () => {
    const text = check
      ? "좋아요. 함께 해보아요"
      : "괜찮아요. 카마코치와 복습해볼게요.";

    alert(text, () => {
      if (check) {
        setStep(4);
      } else {
        setvisible(true);
      }
    });
  };

  return (
    <>
      {!visible ? (
        <>
          <TextArea className="mt-5  tracking-tighter">
            이럴 때 도움이 되는
            <ImporText>마음근육훈련</ImporText>이 있어요. 바로 생각바꾸기를 통해
            유연하게 사고하는 것이에요.
          </TextArea>

          <TextArea className="mt-5">
            <MissionTitle>"생각바꾸기를 기억하시나요?"</MissionTitle>
            <div className="flex flex-col gap-3 mt-10">
              <div className="flex gap-3   w-full">
                <motion.button
                  className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
                  whileTap={{ scale: 1.15 }}
                  onClick={onClick(true)}
                >
                  <img src={mental} className="w-[60px]" />
                  <p className="font-oneMobile text-camaColor1">네</p>
                </motion.button>
                <motion.button
                  className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
                  whileTap={{ scale: 1.15 }}
                  onClick={onClick(false)}
                >
                  <img src={mission} className="w-[60px]" />
                  <p className="font-oneMobile text-camaColor1">아니요</p>
                </motion.button>
              </div>
            </div>
          </TextArea>
        </>
      ) : (
        <>
          <Card4Summary onComplete={() => setStep(3)} />
        </>
      )}
      <Footer onPrev={onPrev} />
    </>
  );
}
