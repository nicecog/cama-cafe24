import Lottie from "lottie-react";
import { motion } from "framer-motion";

import animationData from "@/assets/lotties/congratulations.json";
import image from "@/assets/images/character/excercise.png";

// 저장 완료 후 축하 모달창
export default function Complete(props: any) {
  const { isOpen, onClose } = props;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity z-[11] 
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      {/* 다이얼로그 전체 */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: isOpen ? 0 : "100%", opacity: isOpen ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative bg-white w-full max-w-md mx-4 flex flex-col items-center rounded-xl overflow-hidden z-[99]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🎉 Lottie 애니메이션 (먼저 올라옴) */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isOpen ? 0 : 50, opacity: isOpen ? 1 : 0 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 12,
            delay: 0.2,
          }}
          className="w-full"
        >
          <Lottie
            animationData={animationData}
            loop
            className="w-[340px] h-full object-contain -mt-8"
          />
        </motion.div>

        {/* 🖼️ 말풍선 + 이미지 + 버튼 (딜레이 후 올라옴) */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isOpen ? 0 : 50, opacity: isOpen ? 1 : 0 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 12,
            delay: 0.4,
          }}
          className="w-full pb-3 px-4 flex items-end flex-col absolute bottom-1"
        >
          {/* 💬 말풍선 */}
          <div className="relative bg-white border border-camaColor1 py-3 px-3 rounded-lg shadow-lg mb-2">
            <p className="text-[15px] font-scDream">
              <>
                운동 완료! 🎯
                <br /> 수고했어요!
              </>
            </p>
            <div className="absolute bottom-0 right-16 translate-x-1/2 translate-y-full border-[8px] border-transparent border-t-camaColor1"></div>
          </div>

          {/* 🎭 이미지 */}
          <motion.img
            src={image}
            alt="Foreground Image"
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: isOpen ? 0 : 25, opacity: isOpen ? 1 : 0 }}
            transition={{
              type: "spring",
              stiffness: 110,
              damping: 12,
              delay: 0.5,
            }}
            className="w-[110px] mr-5"
          />

          {/* ✅ 버튼 */}
          <motion.button
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: isOpen ? 0 : 25, opacity: isOpen ? 1 : 0 }}
            transition={{
              type: "spring",
              stiffness: 110,
              damping: 12,
              delay: 0.6,
            }}
            className="mt-3 px-4 py-2 bg-camaColor1 text-white rounded w-full"
            onClick={onClose}
          >
            확인
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
