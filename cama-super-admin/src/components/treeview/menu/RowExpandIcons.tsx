import clsx from "clsx";
import { motion } from "framer-motion";
import { FcOpenedFolder } from "react-icons/fc";
import { FcFile } from "react-icons/fc";

type RowExpandIconType = {
  open?: boolean;
  className?: string;
  level?: number;
  menuType?: string;
  onClick: (e: any) => void;
};

export default function RowExpandIcons(props: RowExpandIconType) {
  // Props;
  const { open, className, menuType, onClick } = props;
  // 애니메이션 효과 줄거면 추가 하자
  // const iconVariants = {
  //   open: { opacity: 1, scale: 1, rotate: 360 },
  //   closed: { opacity: 1, scale: 1, rotate: 0 },
  // };

  // return
  return (
    <motion.div
      className={clsx("expand-icons", className)}
      initial={false}
      animate={open ? "open" : "closed"}
      // variants={iconVariants}
    >
      {menuType === "FOLDER" ? (
        <FcOpenedFolder onClick={onClick} />
      ) : (
        <FcFile />
      )}
    </motion.div>
  );
}
