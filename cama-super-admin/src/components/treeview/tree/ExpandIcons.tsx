import clsx from "clsx";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

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
    open: { opacity: 1, scale: 1, rotate: 180 },
    closed: { opacity: 1, scale: 1, rotate: 90 },
  };

  // return
  return (
    <div
      className={clsx("flex items-center", "text-xs rounded-sm", {
        "border border-white/50": level === 1,
      })}
    >
      <motion.div
        className={clsx("expand-icons", className)}
        initial={false}
        animate={open ? "open" : "closed"}
        variants={iconVariants}
      >
        {!open ? (
          <AiOutlinePlus className="text-[12px] text-[#666]" />
        ) : (
          <AiOutlineMinus className="text-[12px] text-[#666]" />
        )}
      </motion.div>
    </div>
  );
}
