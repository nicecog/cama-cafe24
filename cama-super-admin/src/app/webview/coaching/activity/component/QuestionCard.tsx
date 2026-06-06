import { motion } from "framer-motion";
import MotionButton from "./MotionButton";
import { ReactNode } from "react";

export default function QuestionCard(props: {
  children: ReactNode;
  onClick: (index: number, value: "Y" | "N") => void;
  index: number;
}) {
  const onButtonClick = (value: "Y" | "N") => () => {
    props.onClick(props.index, value);
  };

  return (
    <>
      <motion.div
        className="border bg-white rounded-xl shadow-xl pt-3 pb-7 px-2 text-f6 text-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <h1 className="text-center my-2 font-oneMobile text-f8 text-camaColor1">
          {`질문 ${props.index + 1}`}
        </h1>
        <div className="px-4">{props.children}</div>
        <div className="flex justify-center items-center gap-4 mt-5">
          <MotionButton onClick={onButtonClick("Y")}>예</MotionButton>
          <MotionButton onClick={onButtonClick("N")}>아니요</MotionButton>
        </div>
      </motion.div>
    </>
  );
}
