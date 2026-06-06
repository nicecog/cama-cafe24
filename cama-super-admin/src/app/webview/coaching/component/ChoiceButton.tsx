import { motion } from "framer-motion";
import mental from "@/assets/images/character/mentalheader.png";
import mission from "@/assets/images/character/mission.png";
import MissionTitle from "./Layout/MissionTitle";
import TextArea from "./Layout/TextArea";
import { ReactNode } from "react";
export default function ChoiceButton(props: {
  onClick: (check: "Y" | "N" | "P") => void;
  children?: ReactNode;
  okText?: string;
  cancelText?: ReactNode | string;
  denyText?: string;
  containerClassName?: string;
}) {
  const {
    onClick,
    okText = "네",
    cancelText = "아니오",
    denyText = "",
  } = props;

  return (
    <>
      <TextArea className={`mt-5 ${props.containerClassName}`}>
        <MissionTitle>{props.children}</MissionTitle>
        <div className="flex flex-col gap-3 mt-5">
          <div className="flex gap-3   w-full">
            <motion.button
              className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
              whileTap={{ scale: 1.15 }}
              onClick={() => onClick("Y")}
            >
              <img src={mental} className="w-[60px]" />
              <p className="font-oneMobile text-camaColor1 ">{okText}</p>
            </motion.button>
            <motion.button
              className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
              whileTap={{ scale: 1.15 }}
              onClick={() => onClick("N")}
            >
              <img src={mission} className="w-[60px]" />
              <p className="font-oneMobile text-camaColor1 leading-6">
                {cancelText}
              </p>
            </motion.button>
          </div>
          {denyText && (
            <motion.button
              className="flex items-center justify-center flex-col border bg-white rounded-xl shadow-lg p-1.5 w-full"
              whileTap={{ scale: 1.15 }}
              onClick={() => onClick("P")}
            >
              <img src={mission} className="w-[60px]" />
              <p className="font-oneMobile text-camaColor1">{denyText}</p>
            </motion.button>
          )}
        </div>
      </TextArea>
    </>
  );
}
