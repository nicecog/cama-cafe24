import { motion } from "framer-motion";
import MentalHeader from "@/assets/images/character/mentalheader.png";
import { ReactNode } from "react";

// 심리에서만 사용할 버튼
export default function MentalButton(props: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <div
        className={`flex justify-center  items-center mt-5 w-full px-5 ${props.className}`}
      >
        <motion.button
          className=" border-[2px] px-[15px] py-[5px] flex rounded-xl flex-col items-center w-full bg-white     border-camaColor1 "
          whileTap={{ scale: 1.05 }}
          onClick={props.onClick}
        >
          <img src={MentalHeader} alt="clear" className="w-[50px] h-[50px]" />
          <div className="font-oneMobile text-[25px] text-camaColor1 leading-[32px]  flex justify-start flex-col items-start">
            {props.children}
          </div>
        </motion.button>
      </div>
    </>
  );
}
