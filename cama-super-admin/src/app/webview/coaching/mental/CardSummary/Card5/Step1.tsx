import TextArea from "../../../component/Layout/TextArea";
import { motion } from "framer-motion";

import mission from "@/assets/images/character/mission.png";
import question from "@/assets/images/character/mission.png";
import mental from "@/assets/images/character/mentalheader.png";

import useAlert from "@/hooks/useAlert";
import { useSetAtom } from "jotai";
import { stepAtom } from "./Card5Atom";
import { CardSummaryType } from "../Types/CardSummaryType";
export default function Step1(props: CardSummaryType) {
  const { alert, confirm } = useAlert();

  const setStep = useSetAtom(stepAtom);

  const onClick = (check: boolean) => () => {
    if (check) {
      alert("카마코치와 복습해볼게요.", () => {
        setStep(2);
      });
    } else {
      setStep(3);
    }
  };

  const complete = () => {
    confirm(
      { html: `복식 호흡 과 명상을 이해하는 데 <br/>도움이 되셨나요?` },
      () => {
        props.onComplete();
      }
    );
  };

  return (
    <>
      <div>{props.children}</div>
      <TextArea>
        {/* <MissionTitle>"복식 호흡을 기억하시나요?"</MissionTitle> */}
        <div className="flex flex-col gap-3 mt-10">
          <div className="flex gap-3   w-full">
            <motion.button
              className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
              whileTap={{ scale: 1.15 }}
              onClick={onClick(true)}
            >
              <img src={mental} className="w-[60px]" />
              <p className="font-oneMobile text-camaColor1">복식호흡</p>
            </motion.button>
            <motion.button
              className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
              whileTap={{ scale: 1.15 }}
              onClick={onClick(false)}
            >
              <img src={mission} className="w-[60px]" />
              <p className="font-oneMobile text-camaColor1">명상</p>
            </motion.button>
          </div>
          <motion.button
            className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
            whileTap={{ scale: 1.15 }}
            onClick={complete}
          >
            <img src={question} className="w-[60px]" />
            <p className="font-oneMobile text-camaColor1">
              오늘은 그만 할게요.
            </p>
          </motion.button>
        </div>
      </TextArea>
    </>
  );
}
