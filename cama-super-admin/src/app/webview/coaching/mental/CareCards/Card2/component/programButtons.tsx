import TextArea from "@/app/webview/coaching/component/Layout/TextArea";

import mental from "@/assets/images/character/mentalheader.png";
import mission from "@/assets/images/character/mission.png";
import question from "@/assets/images/character/question.png";
import clear from "@/assets/images/character/missionClear.png";
import { motion } from "framer-motion";
import { useSetAtom } from "jotai";
import { stepAtom } from "../../CareCardAtom";

export default function ProgramButtons(props: { type: string }) {
  const setStep = useSetAtom(stepAtom);

  const onClick = (step: number) => () => {
    setStep(step);
  };

  return (
    <>
      <TextArea className="mt-10 text-justify tracking-tighter">
        <div className="flex gap-4 flex-col w-full">
          <div className="flex w-full gap-4">
            {props.type !== "type1" && (
              <motion.button
                className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-2 w-full"
                whileTap={{ scale: 1.15 }}
                onClick={onClick(6)}
              >
                <img src={mental} className="w-[60px]" />
                <p className="font-oneMobile text-camaColor1">생각바꾸기</p>
              </motion.button>
            )}
            {props.type !== "type2" && (
              <motion.button
                className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-2 w-full"
                whileTap={{ scale: 1.15 }}
                onClick={onClick(10)}
              >
                <img src={mission} className="w-[60px]" />
                <p className="font-oneMobile text-camaColor1">마음표현하기</p>
              </motion.button>
            )}
          </div>
          {props.type !== "type3" && (
            <motion.button
              className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-2 w-full"
              whileTap={{ scale: 1.09 }}
              onClick={onClick(12)}
            >
              <img src={question} className="w-[60px]" />
              <p className="font-oneMobile text-camaColor1">
                명상,호흡으로 이완하기
              </p>
            </motion.button>
          )}
          {props.type !== "all" && (
            <motion.button
              className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-2 w-full"
              whileTap={{ scale: 1.09 }}
              onClick={onClick(13)}
            >
              <img src={clear} className="w-[60px]" />
              <p className="font-oneMobile text-camaColor1">
                아니오, 그만할래요
              </p>
            </motion.button>
          )}
        </div>
      </TextArea>
    </>
  );
}
