import clsx from "clsx";
import { motion } from "framer-motion";
import { SlArrowRight } from "react-icons/sl";
export default function ExpandIcons({
  open,
  className,
  level,
}: {
  open?: boolean;
  className?: string;
  level?: number;
}) {
  // 애니메이션 효과 줄거면 추가 하자
  const iconVariants = {
    open: { opacity: 1, scale: 1, rotate: 270 },
    closed: { opacity: 1, scale: 1, rotate: 90 },
  };

  // return
  return (
    <div
      className={clsx(
        "flex items-center",
        "text-xs w-[16px] h-[16px] rounded-sm",
        {
          "border border-white/50": level === 1,
        }
      )}
    >
      <motion.div
        className={clsx("expand-icons", className)}
        initial={false}
        animate={open ? "open" : "closed"}
        variants={iconVariants}
      >
        <SlArrowRight />
        {/* {!open ? <AiOutlinePlusSquare /> : <AiOutlineMinusSquare />} */}
      </motion.div>
    </div>
  );
}
