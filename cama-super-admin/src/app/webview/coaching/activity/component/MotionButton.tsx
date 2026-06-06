import { ReactNode } from "react";

import { motion } from "framer-motion";

export default function MotionButton(props: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <>
      <motion.button
        className=" font-oneMobile text-f6 py-2 w-[120px] rounded-xl shadow-xl bg-camaColor1 text-white"
        whileTap={{ scale: 1.15 }}
        onClick={props.onClick}
      >
        {props.children}
      </motion.button>
    </>
  );
}
