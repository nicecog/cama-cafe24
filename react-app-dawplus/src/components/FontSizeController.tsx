import { motion } from "framer-motion";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useFontSize } from "@/hooks/useFontSize";

export const FontSizeController = () => {
  const { scale, increase, decrease, reset } = useFontSize();

  const isMinScale = scale === "small";
  const isMaxScale = scale === "xxlarge";
  const isDefault = scale === "medium";

  return (
    <div className="flex items-center gap-1">
      <motion.button
        onClick={decrease}
        disabled={isMinScale}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="rounded-full p-1 text-gray-600 transition-all duration-200 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="글자 크기 줄이기"
        title="글자 크기 줄이기"
      >
        <ZoomOut className="h-5 w-5 transition-transform duration-200 hover:-rotate-6" />
      </motion.button>

      <motion.button
        onClick={reset}
        disabled={isDefault}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="rounded-full p-1 text-gray-600 transition-all duration-200 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="기본 크기로 되돌리기"
        title="기본 크기로 되돌리기"
      >
        <RotateCcw className="h-4 w-4 transition-transform duration-200 hover:rotate-180" />
      </motion.button>

      <motion.button
        onClick={increase}
        disabled={isMaxScale}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="rounded-full p-1 text-gray-600 transition-all duration-200 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="글자 크기 키우기"
        title="글자 크기 키우기"
      >
        <ZoomIn className="h-5 w-5 transition-transform duration-200 hover:rotate-6" />
      </motion.button>
    </div>
  );
};
