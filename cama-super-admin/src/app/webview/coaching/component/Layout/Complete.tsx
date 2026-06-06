import Lottie from "lottie-react";
import { motion } from "framer-motion";

import animationData from "@/assets/lotties/congratulations.json";
import image from "@/assets/images/character/char4.png";
import { useMemo } from "react";

// 저장 완료 후 축하 모달창
export default function Complete(props: any) {
  const { isOpen, onClose } = props;

  // ✅ 랜덤한 메시지를 JSX 형식으로 저장
  const messages = [
    <>
      미션 완료!
      <br />
      작은 노력이 큰 변화를 만듭니다.
    </>,
    <>
      대단해요!
      <br />
      오늘도 한 걸음 더 건강에 가까워졌어요!
    </>,
    <>
      오늘도 마음을 돌보는 시간을 가지셨군요.
      <br />
      멋집니다!
    </>,
    <>
      건강한 습관을 실천하셨습니다!
      <br />
      내일도 응원할게요!
    </>,
  ];
  const randomMessage = useMemo(
    () => messages[Math.floor(Math.random() * messages.length)],
    [isOpen]
  );

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
          <div className="relative bg-white border border-camaColor1 py-5 px-3 rounded-lg shadow-lg mb-2">
            <p className="text-[15px] font-scDream">{randomMessage}</p>
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
            className="w-[120px] mr-5"
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
            미션완료
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
