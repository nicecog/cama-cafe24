import { motion } from "framer-motion";
import Clover from "@/assets/images/character/clover.png";
import UnClover from "@/assets/images/character/unClover.png";
import { FcApproval } from "react-icons/fc";

export default function MotionButton(props: any) {
  // props
  const { onClick, active, disabled, scale = 1.12, day, isComplete } = props;

  return (
    <>
      {disabled ? (
        <>
          <button
            className={`w-[70px] h-[70px]  bg-[#F7F7F7] flex justify-center items-center relative rounded-md  flex-col transform perspective-xl rotate-x-12  -space-y-0.5`}
          >
            <span className="mt-1">
              <img src={UnClover} />
            </span>
            <span className="text-text text-[16px] font-notoR mt-1">
              {day}일차
            </span>
          </button>
        </>
      ) : (
        <motion.button
          className={`w-[70px] h-[70px]  bg-[#FCF8EF] flex justify-center items-center relative rounded-md  flex-col transform perspective-xl rotate-x-12 -space-y-0.5 
                  ${active && "!bg-[#a2d4ff] "}
                `}
          whileTap={{ scale }}
          onClick={onClick}
        >
          <span className="mt-1">
            {isComplete ? (
              <FcApproval className="absolute top-1.5 right-1.5" />
            ) : null}
            <img src={Clover} />
          </span>
          <span className="text-camaColor text-[16px] font-bold mt-1">
            {day === 0 ? "시작" : `${day}일차`}
          </span>
        </motion.button>
      )}
    </>
  );
}
